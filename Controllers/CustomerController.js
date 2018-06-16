'use strict';

const Service = require('../Services');
const UniversalFunctions = require('../Utils/UniversalFunctions');
const APP_CONSTANTS = require('../Config/appConstants');
const async = require('async');
const TokenManager = require('../Lib/TokenManager')



const createCustomer = function (payloadData, callback) {

    let accessToken = null;
    let uniqueCode = null;
    let dataToSave = payloadData;
    if (dataToSave.password)
        dataToSave.password = UniversalFunctions.CryptData(dataToSave.password);
    dataToSave.firstTimeLogin = false;
    let customerData = null;
    let dataToUpdate = {};
    if (payloadData.profilePic && payloadData.profilePic.filename) {
        dataToUpdate.profilePicURL = {
            original: null,
            thumbnail: null
        }
    }

    async.series([
        function (cb) {
            //verify email address
            if (!UniversalFunctions.verifyEmailFormat(dataToSave.email)) {
                cb(APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_EMAIL);
            } else {
                cb();
            }
        },
        function (cb) {
            //Validate for facebookId and password
            if (dataToSave.facebookId) {
                if (dataToSave.password) {
                    cb(APP_CONSTANTS.STATUS_MSG.ERROR.FACEBOOK_ID_PASSWORD_ERROR);
                } else {
                    cb();
                }
            } else if (!dataToSave.password) {
                cb(APP_CONSTANTS.STATUS_MSG.ERROR.PASSWORD_REQUIRED);
            } else {
                cb();
            }
        },
        function (cb) {
            //Validate countryCode
            if (dataToSave.countryCode.lastIndexOf('+') === 0) {
                if (!isFinite(dataToSave.countryCode.substr(1))) {
                    cb(APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_COUNTRY_CODE);
                }
                else {
                    cb();
                }
            } else {
                cb(APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_COUNTRY_CODE);
            }
        },
        function (cb) {
            //Validate phone No
            if (dataToSave.phoneNo && dataToSave.phoneNo.split('')[0] === 0) {
                cb(APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_PHONE_NO_FORMAT);
            } else {
                cb();
            }
        },
        function (cb) {
            //Insert Into DB
            dataToSave.OTPCode = uniqueCode;
            dataToSave.registrationDate = new Date().toISOString();
            dataToSave.emailVerificationToken = UniversalFunctions.CryptData(JSON.stringify(dataToSave));
            Service.CustomerService.createCustomer(dataToSave, function (err, customerDataFromDB) {
                console.log('customeized erro', err, customerDataFromDB)
                if (err) {
                    if (err.code === 11000 && err.message.indexOf('customers.$phoneNo_1') > -1) {
                        cb(APP_CONSTANTS.STATUS_MSG.ERROR.PHONE_NO_EXIST);

                    } else if (err.code === 11000 && err.message.indexOf('customers.$email_1') > -1) {
                        cb(APP_CONSTANTS.STATUS_MSG.ERROR.EMAIL_ALREADY_EXIST);

                    } else {
                        cb(err)
                    }
                } else {
                    customerData = customerDataFromDB;
                    cb();
                }
            })
        },
        function (cb) {
            //Set Access Token
            if (customerData) {
                let tokenData = {
                    id: customerData._id,
                    type: APP_CONSTANTS.DATABASE.USER_ROLES.CUSTOMER
                };
                TokenManager.setToken(tokenData, function (err, output) {
                    if (err) {
                        cb(err);
                    } else {
                        accessToken = output && output.accessToken || null;
                        cb();
                    }
                })
            } else {
                cb(APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
            }
        }
    ], function (err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, {
                accessToken: accessToken,
                userDetails: UniversalFunctions.deleteUnnecessaryUserData(customerData.toObject())
            });
        }
    });
};

const loginCustomer = function (payloadData, callback) {
    let userFound = false;
    let accessToken = null;
    let successLogin = false;
    let flushPreviousSessions = payloadData.flushPreviousSessions || false;
    let updatedUserDetails = null;
    async.series([
        function (cb) {
            //verify email address
            if (!UniversalFunctions.verifyEmailFormat(payloadData.email)) {
                cb(APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_EMAIL);
            } else {
                cb();
            }
        },
        function (cb) {
            let criteria = {
                email: payloadData.email
            };
            let projection = {};
            let option = {
                lean: true
            };
            Service.CustomerService.getCustomer(criteria, projection, option, function (err, result) {
                if (err) {
                    cb(err)
                } else {
                    userFound = result && result[0] || null;
                    cb();
                }
            });

        },
        function (cb) {
            //validations
            if (!userFound) {
                cb(APP_CONSTANTS.STATUS_MSG.ERROR.EMAIL_NOT_FOUND);
            } else {
                if (userFound && userFound.password !== UniversalFunctions.CryptData(payloadData.password)) {
                    cb(APP_CONSTANTS.STATUS_MSG.ERROR.INCORRECT_PASSWORD);
                } else {
                    successLogin = true;
                    cb();
                }
            }
        },
        function (cb) {
            //Clear Device Tokens if present anywhere else
            if (userFound && payloadData.deviceToken !== userFound.deviceToken && !flushPreviousSessions) {
                cb(APP_CONSTANTS.STATUS_MSG.ERROR.ACTIVE_PREVIOUS_SESSIONS)
            } else {
                let criteria = {
                    deviceToken: payloadData.deviceToken
                };
                let setQuery = {
                    $unset: {deviceToken: 1}
                };
                let options = {
                    multi: true
                };
                Service.CustomerService.updateCustomer(criteria, setQuery, options, cb)
            }
        },
        function (cb) {
            let criteria = {
                _id: userFound._id
            };
            let setQuery = {
                appVersion: payloadData.appVersion,
                deviceToken: payloadData.deviceToken,
                deviceType: payloadData.deviceType,
                language: payloadData.language
            };
            Service.CustomerService.updateCustomer(criteria, setQuery, {new: true}, function (err, data) {
                updatedUserDetails = data;
                cb(err, data);
            });

        },
        function (cb) {
            if (successLogin) {
                let tokenData = {
                    id: userFound._id,
                    type: APP_CONSTANTS.DATABASE.USER_ROLES.CUSTOMER
                };
                TokenManager.setToken(tokenData, function (err, output) {
                    if (err) {
                        cb(err);
                    } else {
                        if (output && output.accessToken) {
                            accessToken = output && output.accessToken;
                            cb();
                        } else {
                            cb(APP_CONSTANTS.ERROR.IMP_ERROR)
                        }
                    }
                })
            } else {
                cb(APP_CONSTANTS.ERROR.IMP_ERROR)
            }

        }
    ], function (err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, {
                accessToken: accessToken,
                userDetails: UniversalFunctions.deleteUnnecessaryUserData(updatedUserDetails.toObject())
            });
        }
    });
};



const updateCustomer = function (userPayload, userData, callback) {
    let dataToUpdate = {};
    let updatedUser = null;
    let samePhoneNo = false;
    let uniqueCode = null;
    let phoneNoUpdateRequest = false;
    let newCountryCode = null;
    if (!userPayload || !userData) {
        callback(APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);
    } else {
        if (userPayload.phoneNo && userPayload.countryCode) {
            samePhoneNo = (userData.phoneNo === userPayload.phoneNo);
            samePhoneNo = (userData.countryCode === userPayload.phoneNo);
        }
        if (userPayload.name && userPayload.name !== '') {
            dataToUpdate.name = UniversalFunctions.sanitizeName(userPayload.name);
        }
        if (userPayload.deviceToken && userPayload.deviceToken !== '') {
            dataToUpdate.deviceToken = userPayload.deviceToken;
        }
        if (userPayload.phoneNo && userPayload.countryCode &&
            userData.phoneNo === userPayload.phoneNo && userData.countryCode === userPayload.countryCode) {
            delete userPayload.phoneNo;
            delete userPayload.countryCode;
        }

        if (userPayload.phoneNo && userPayload.phoneNo !== '') {
            dataToUpdate.newNumber = userPayload.phoneNo;
        }
        if (userPayload.countryCode && userPayload.countryCode !== '') {
            newCountryCode = userPayload.countryCode;
        }
        if (userPayload.email && userPayload.email !== '') {
            dataToUpdate.email = userPayload.email;
        }
        if (userPayload.language && (userPayload.language === APP_CONSTANTS.DATABASE.LANGUAGE.EN
            || userPayload.language === APP_CONSTANTS.DATABASE.LANGUAGE.ES_MX)) {
            dataToUpdate.language = userPayload.language;
        }
        if (userPayload.profilePic && userPayload.profilePic.filename) {
            dataToUpdate.profilePicURL = {
                original: null,
                thumbnail: null
            }
        }
        if (Object.keys(dataToUpdate).length === 0) {
            callback(APP_CONSTANTS.STATUS_MSG.ERROR.NOTHING_TO_UPDATE);
        } else {
            async.series([
                function (cb) {
                    //verify email address
                    if (dataToUpdate.email && !UniversalFunctions.verifyEmailFormat(dataToUpdate.email)) {
                        cb(APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_EMAIL);
                    } else {
                        cb();
                    }
                },
                function (cb) {
                    //Validate phone No
                    if (userPayload.phoneNo && userPayload.phoneNo.split('')[0] === 0) {
                        cb(APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_PHONE_NO_FORMAT);
                    } else {
                        cb();
                    }
                },
                function (cb) {
                    //Validate countryCode and phoneNo
                    if (userPayload.countryCode) {
                        if (userPayload.countryCode.lastIndexOf('+') === 0) {
                            if (!isFinite(userPayload.countryCode.substr(1))) {
                                cb(APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_COUNTRY_CODE);
                            }
                            else if (!userPayload.phoneNo || userPayload.phoneNo === '') {
                                cb(APP_CONSTANTS.STATUS_MSG.ERROR.PHONE_NO_MISSING);
                            } else {
                                cb();
                            }
                        } else {
                            cb(APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_COUNTRY_CODE);
                        }
                    } else if (userPayload.phoneNo) {
                        if (!userPayload.countryCode) {
                            cb(APP_CONSTANTS.STATUS_MSG.ERROR.COUNTRY_CODE_MISSING);
                        } else if (userPayload.countryCode && userPayload.countryCode.lastIndexOf('+') === 0) {
                            if (!isFinite(userPayload.countryCode.substr(1))) {
                                cb(APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_COUNTRY_CODE);
                            } else {
                                cb();
                            }
                        } else {
                            cb(APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_COUNTRY_CODE);
                        }
                    } else {
                        cb();
                    }
                },
                function (cb) {
                    //Check all empty values validations
                    if (userPayload.name && !dataToUpdate.name) {
                        cb(APP_CONSTANTS.STATUS_MSG.ERROR.EMPTY_VALUE)
                    } else if (dataToUpdate.name) {
                        UniversalFunctions.customQueryDataValidations('NAME', 'name', dataToUpdate.name, cb)
                    } else {
                        cb();
                    }

                },
                function (cb) {
                    if (userPayload.countryCode && userPayload.phoneNo && !samePhoneNo) {
                        let criteria = {
                            countryCode: userPayload.countryCode,
                            phoneNo: userPayload.phoneNo
                        };
                        let projection = {};
                        let option = {
                            lean: true
                        };
                        Service.CustomerService.getCustomer(criteria, projection, option, function (err, result) {
                            if (err) {
                                cb(err)
                            } else {
                                if (result && result.length > 0) {
                                    cb(APP_CONSTANTS.STATUS_MSG.ERROR.PHONE_ALREADY_EXIST)
                                } else {
                                    cb();
                                }
                            }
                        });
                    } else {
                        cb();
                    }
                },
                function (cb) {
                    //Update User
                    let criteria = {
                        _id: userData._id
                    };
                    let setQuery = {
                        $set: dataToUpdate
                    };
                    Service.CustomerService.updateCustomer(criteria, setQuery, {new: true}, function (err, updatedData) {
                        updatedUser = updatedData;
                        cb(err, updatedData)
                    })
                }
            ], function (err, result) {
                if (err) {
                    callback(err)
                } else {
                    callback(null, {
                        phoneNoUpdateRequest: phoneNoUpdateRequest,
                        userData: UniversalFunctions.deleteUnnecessaryUserData(updatedUser.toObject())
                    });
                }
            })
        }
    }
};



const logoutCustomer = function (userData, callback) {
    if (!userData || !userData._id) {
        callback(APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);
    } else {
        let userId = userData && userData._id || 1;

        async.series([
            function (cb) {
                cb();
            },
            function (cb) {
                let criteria = {
                    _id: userId
                };
                let setQuery = {
                    $unset: {
                        accessToken: 1
                    }
                };
                let options = {};
                Service.CustomerService.updateCustomer(criteria, setQuery, options, cb);
            }
        ], function (err, result) {
            callback(err, null);
        })
    }
};


module.exports = {
    createCustomer: createCustomer,
    logoutCustomer: logoutCustomer,
    loginCustomer: loginCustomer,
    updateCustomer: updateCustomer
};