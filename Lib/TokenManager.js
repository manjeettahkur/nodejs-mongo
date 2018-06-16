'use strict';

const Config = require('../Config');
const Jwt = require('jsonwebtoken');
const async = require('async');
const Service = require('../Services');


const getTokenFromDB = function (userId, userType,token, callback) {
  let userData = null;
  let criteria = {
    _id: userId,
    accessToken : token
  };
  async.series([
    function (cb) {
      if (userType === Config.APP_CONSTANTS.DATABASE.USER_ROLES.CUSTOMER){
        Service.CustomerService.getCustomer(criteria,{},{lean:true}, function (err, dataAry) {
          if (err){
            cb(err)
          }else {
            if (dataAry && dataAry.length > 0){
              userData = dataAry[0];
              cb();
            }else {
              cb(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN)
            }
          }

        });

      }
      else if (userType === Config.APP_CONSTANTS.DATABASE.USER_ROLES.DRIVER){
        Service.DriverService.getDriver(criteria,{},{lean:true}, function (err, dataAry) {
          if (err){
            cb(err)
          }else {
            if (dataAry && dataAry.length > 0){
              userData = dataAry[0];
              cb();
            }else {
              cb(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN)
            }
          }

        });

      }
      else if (userType === Config.APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN){
        Service.AdminService.getAdmin(criteria,{},{lean:true}, function (err, dataAry) {
          if (err){
            callback(err)
          }else {
            if (dataAry && dataAry.length > 0){
              userData = dataAry[0];
              cb();
            }else {
              callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN)
            }
          }

        });
      }else {
        cb(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
      }
    }
  ], function (err, result) {
    if (err){
      callback(err)
    }else {
      if (userData && userData._id){
        userData.id = userData._id;
        userData.type = userType;
      }
      callback(null,{userData: userData})
    }

  });
};

const setTokenInDB = function (userId,userType, tokenToSave, callback) {
  let criteria = {
    _id: userId
  };
  let setQuery = {
    accessToken : tokenToSave
  };
  async.series([
    function (cb) {
      if (userType === Config.APP_CONSTANTS.DATABASE.USER_ROLES.CUSTOMER){
        Service.CustomerService.updateCustomer(criteria,setQuery,{new:true}, function (err, dataAry) {
          if (err){
            cb(err)
          }else {
            if (dataAry && dataAry._id){
              cb();
            }else {
              cb(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
            }
          }
        });

      }
      else if (userType == Config.APP_CONSTANTS.DATABASE.USER_ROLES.DRIVER){
        Service.DriverService.updateDriver(criteria,setQuery,{new:true}, function (err, dataAry) {
          if (err){
            cb(err)
          }else {
            if (dataAry && dataAry._id){
              cb();
            }else {
              cb(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
            }
          }

        });

      }
      else if (userType === Config.APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN){
        Service.AdminService.updateAdmin(criteria,setQuery,{new:true}, function (err, dataAry) {
          if (err){
            cb(err)
          }else {
            if (dataAry && dataAry._id){
              cb();
            }else {
              cb(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
            }
          }

        });
      }else {
        cb(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
      }
    }
  ], function (err, result) {
    if (err){
      callback(err)
    }else {
      callback()
    }

  });
};

const expireTokenInDB = function (userId,userType, callback) {
  let criteria = {
    _id: userId
  };
  let setQuery = {
    accessToken : null
  };
  async.series([
    function (cb) {
      if (userType === Config.APP_CONSTANTS.DATABASE.USER_ROLES.DRIVER){
        Service.CustomerService.updateCustomer(criteria,setQuery,{new:true}, function (err, dataAry) {
          if (err){
            cb(err)
          }else {
            if (dataAry && dataAry.length > 0){
              cb();
            }else {
              cb(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN)
            }
          }
        });

      }
      else if (userType === Config.APP_CONSTANTS.DATABASE.USER_ROLES.DRIVER){
        Service.DriverService.updateDriver(criteria,setQuery,{new:true}, function (err, dataAry) {
          if (err){
            cb(err)
          }else {
            if (dataAry && dataAry.length > 0){
              cb();
            }else {
              cb(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN)
            }
          }

        });

      }
      else if (userType === Config.APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN){
        Service.AdminService.updateAdmin(criteria,setQuery,{new:true}, function (err, dataAry) {
          if (err){
            callback(err)
          }else {
            if (dataAry && dataAry.length > 0){
              cb();
            }else {
              callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN)
            }
          }

        });
      }else {
        cb(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
      }
    }
  ], function (err, result) {
    if (err){
      callback(err)
    }else {
      callback()
    }

  });
};


const verifyToken = function (token, callback) {
  let response = {
    valid: false
  };
  Jwt.verify(token, Config.APP_CONSTANTS.SERVER.JWT_SECRET_KEY, function (err, decoded) {
    console.log('jwt err',err,decoded)
    if (err) {
      callback(err)
    } else {
      getTokenFromDB(decoded.id, decoded.type,token, callback);
    }
  });
};

const setToken = function (tokenData, callback) {
  if (!tokenData.id || !tokenData.type) {
    callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);
  } else {
    let tokenToSend = Jwt.sign(tokenData, Config.APP_CONSTANTS.SERVER.JWT_SECRET_KEY);
    setTokenInDB(tokenData.id,tokenData.type, tokenToSend, function (err, data) {
      console.log('token>>>>',err,data)
      callback(err, {accessToken: tokenToSend})
    })
  }
};

const expireToken = function (token, callback) {
  Jwt.verify(token, Config.APP_CONSTANTS.SERVER.JWT_SECRET_KEY, function (err, decoded) {
    if (err) {
      callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN);
    } else {
      expireTokenInDB(decoded.id,decoded.type, function (err, data) {
        callback(err, data)
      });
    }
  });
};

const decodeToken = function (token, callback) {
  Jwt.verify(token, Config.APP_CONSTANTS.SERVER.JWT_SECRET_KEY, function (err, decodedData) {
    if (err) {
      callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN);
    } else {
      callback(null, decodedData)
    }
  })
};

module.exports = {
  expireToken: expireToken,
  setToken: setToken,
  verifyToken: verifyToken,
  decodeToken: decodeToken
};