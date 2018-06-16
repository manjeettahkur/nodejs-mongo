
const Joi = require('joi');

const MD5 = require('md5');
const Boom = require('boom');
const CONFIG = require('../Config');

const randomstring = require("randomstring");

const distance = require('google-distance-matrix');
distance.key(CONFIG.APP_CONSTANTS.SERVER.GOOGLE_API_KEY);
const validator = require('validator');


const VALID_ERRAND_STATUS_ARRAY = [];
for (let key in CONFIG.APP_CONSTANTS.DATABASE.ERRANDS_STATUS) {
    if (CONFIG.APP_CONSTANTS.DATABASE.ERRANDS_STATUS.hasOwnProperty(key)) {
        VALID_ERRAND_STATUS_ARRAY.push(CONFIG.APP_CONSTANTS.DATABASE.ERRANDS_STATUS[key])
    }
}



const sendError = function (data) {

    if (typeof data === 'object' && data.hasOwnProperty('statusCode') && data.hasOwnProperty('customMessage')) {
        console.log('attaching resposnetype',data.type)
        let errorToSend = Boom.create(data.statusCode, data.customMessage);
        errorToSend.output.payload.responseType = data.type;
        return errorToSend;
    } else {
        let errorToSend = '';
        if (typeof data === 'object') {
            if (data.name === 'MongoError') {
                errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR.customMessage;
                if (data.code = 11000) {
                    let duplicateValue = data.errmsg && data.errmsg.substr(data.errmsg.lastIndexOf('{ : "') + 5);
                    duplicateValue = duplicateValue.replace('}','');
                    errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.DUPLICATE.customMessage + " : " + duplicateValue;
                    if (data.message.indexOf('customer_1_streetAddress_1_city_1_state_1_country_1_zip_1')>-1){
                        errorToSend = CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.DUPLICATE_ADDRESS.customMessage;
                    }
                }
            } else if (data.name === 'ApplicationError') {
                errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.APP_ERROR.customMessage + ' : ';
            } else if (data.name === 'ValidationError') {
                errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.APP_ERROR.customMessage + data.message;
            } else if (data.name === 'CastError') {
                errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR.customMessage + CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ID.customMessage + data.value;
            }
        } else {
            errorToSend = data
        }
        let customErrorMessage = errorToSend;
        if (typeof customErrorMessage === 'string'){
            if (errorToSend.indexOf("[") > -1) {
                customErrorMessage = errorToSend.substr(errorToSend.indexOf("["));
            }
            customErrorMessage = customErrorMessage && customErrorMessage.replace(/"/g, '');
            customErrorMessage = customErrorMessage && customErrorMessage.replace('[', '');
            customErrorMessage = customErrorMessage && customErrorMessage.replace(']', '');
        }
        return Boom.create(400,customErrorMessage)
    }
};

const sendSuccess = function (successMsg, data) {
    successMsg = successMsg || CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT.customMessage;
    if (typeof successMsg === 'object' && successMsg.hasOwnProperty('statusCode') && successMsg.hasOwnProperty('customMessage')) {
        return {statusCode:successMsg.statusCode, message: successMsg.customMessage, data: data || null};

    }else {
        return {statusCode:200, message: successMsg, data: data || null};

    }
};


const failActionFunction = function (request, reply, source, error) {
    let customErrorMessage = '';
    if (error.output.payload.message.indexOf("[") > -1) {
        customErrorMessage = error.output.payload.message.substr(error.output.payload.message.indexOf("["));
    } else {
        customErrorMessage = error.output.payload.message;
    }
    customErrorMessage = customErrorMessage.replace(/"/g, '');
    customErrorMessage = customErrorMessage.replace('[', '');
    customErrorMessage = customErrorMessage.replace(']', '');
    error.output.payload.message = customErrorMessage;
    delete error.output.payload.validation
    return reply(error);
};




const authorizationHeaderObj = Joi.object({
    authorization: Joi.string().required()
}).unknown();


const CryptData = function (stringToCrypt) {
    return MD5(MD5(stringToCrypt));
};

const generateRandomString = function () {
    return randomstring.generate(7);
};

const filterArray = function (array) {
    return array.filter(function (n) {
        return n != undefined && n != ''
    });
};

const sanitizeName = function (string) {
    return filterArray(string && string.split(' ') || []).join(' ')
};

const verifyEmailFormat = function (string) {
    return validator.isEmail(string)
};


const deleteUnnecessaryUserData = userObj => {
  if (userObj) {
    delete userObj['__v']
    delete userObj['password']
    delete userObj['accessToken']
    delete userObj['emailVerificationToken']
    delete userObj['passwordResetToken']
    delete userObj['registrationDate']
    delete userObj['OTPCode']
    delete userObj['facebookId']
    delete userObj['codeUpdatedAt']
    delete userObj['deviceType']
    delete userObj['deviceToken']
    delete userObj['appVersion']
    delete userObj['isBlocked']
    delete userObj['referBy']
    return userObj
  }
  return userObj
}



module.exports = {
    sendError: sendError,
    sendSuccess: sendSuccess,
    CryptData: CryptData,
    failActionFunction: failActionFunction,
    verifyEmailFormat: verifyEmailFormat,
    sanitizeName: sanitizeName,
    filterArray: filterArray,
    generateRandomString: generateRandomString,
    authorizationHeaderObj: authorizationHeaderObj,
    deleteUnnecessaryUserData: deleteUnnecessaryUserData
};