'use strict';

var SERVER = {
  APP_NAME: 'Demo',
  PORTS: {
    HAPI: 3000
  },
  TOKEN_EXPIRATION_IN_MINUTES: 600,
  JWT_SECRET_KEY: 'sUPerSeCuREKeY&^$^&$^%$^%7782348723t4872t34Ends',
  COUNTRY_CODE : '+91',
  THUMB_WIDTH : 50,
  THUMB_HEIGHT : 50,
  DOMAIN_NAME : 'http://localhost:3000/'
};

const DATABASE = {
  PROFILE_PIC_PREFIX : {
    ORIGINAL : 'profilePic_',
    THUMB : 'profileThumb_'
  },
  LOGO_PREFIX : {
    ORIGINAL : 'logo_',
    THUMB : 'logoThumb_'
  },
  DOCUMENT_PREFIX : 'document_',
  USER_ROLES: {
    ADMIN: 'ADMIN',
    CUSTOMER: 'CUSTOMER',
    DRIVER: 'DRIVER'
  },
  FILE_TYPES: {
    LOGO: 'LOGO',
    DOCUMENT: 'DOCUMENT',
    OTHERS: 'OTHERS'
  },
  VEHICLE_TYPE: {
    BICYCLE: 'BICYCLE',
    SCOOTER: 'SCOOTER',
    CAR: 'CAR'
  },
  DEVICE_TYPES: {
    IOS: 'IOS',
    ANDROID: 'ANDROID'
  },
  LANGUAGE: {
    EN: 'EN',
    ES_MX: 'ES_MX'
  },
  PAYMENT_OPTIONS : {
    CREDIT_DEBIT_CARD : 'CREDIT_DEBIT_CARD',
    PAYPAL : 'PAYPAL',
    BITCOIN : 'BITCOIN',
    GOOGLE_WALLET : 'GOOGLE_WALLET',
    APPLE_PAY : 'APPLE_PAY',
    EIYA_CASH : 'EIYA_CASH'
  }
};

const STATUS_MSG = {
  ERROR: {
    INVALID_USER_PASS: {
      statusCode:401,
      type: 'INVALID_USER_PASS',
      customMessage : 'Invalid username or password'
    },
    TOKEN_ALREADY_EXPIRED: {
      statusCode:401,
      customMessage : 'Token Already Expired',
      type : 'TOKEN_ALREADY_EXPIRED'
    },
    DB_ERROR: {
      statusCode:400,
      customMessage : 'DB Error : ',
      type : 'DB_ERROR'
    },
    INVALID_ID: {
      statusCode:400,
      customMessage : 'Invalid Id Provided : ',
      type : 'INVALID_ID'
    },
    APP_ERROR: {
      statusCode:400,
      customMessage : 'Application Error',
      type : 'APP_ERROR'
    },
    ADDRESS_NOT_FOUND: {
      statusCode:400,
      customMessage : 'Address not found',
      type : 'ADDRESS_NOT_FOUND'
    },
    SAME_ADDRESS_ID: {
      statusCode:400,
      customMessage : 'Pickup and Delivery Address Cannot Be Same',
      type : 'SAME_ADDRESS_ID'
    },
    PICKUP_ADDRESS_NOT_FOUND: {
      statusCode:400,
      customMessage : 'Pickup Address not found',
      type : 'PICKUP_ADDRESS_NOT_FOUND'
    },
    DELIVERY_ADDRESS_NOT_FOUND: {
      statusCode:400,
      customMessage : 'Delivery Address not found',
      type : 'DELIVERY_ADDRESS_NOT_FOUND'
    },
    IMP_ERROR: {
      statusCode:500,
      customMessage : 'Implementation Error',
      type : 'IMP_ERROR'
    },
    APP_VERSION_ERROR: {
      statusCode:400,
      customMessage : 'One of the latest version or updated version value must be present',
      type : 'APP_VERSION_ERROR'
    },
    RANK_ERROR: {
      statusCode:500,
      customMessage : 'Unable to update rank of the referrer',
      type : 'RANK_ERROR'
    },
    INVALID_TOKEN: {
      statusCode:401,
      customMessage : 'Invalid token provided',
      type : 'INVALID_TOKEN'
    },
    INVALID_CODE: {
      statusCode:400,
      customMessage : 'Invalid Verification Code',
      type : 'INVALID_CODE'
    },
    DEFAULT: {
      statusCode:400,
      customMessage : 'Error',
      type : 'DEFAULT'
    },
    PHONE_NO_EXIST: {
      statusCode:400,
      customMessage : 'Phone No Already Exist',
      type : 'PHONE_NO_EXIST'
    },
    EMAIL_EXIST: {
      statusCode:400,
      customMessage : 'Email Already Exist',
      type : 'EMAIL_EXIST'
    },
    DUPLICATE: {
      statusCode:400,
      customMessage : 'Duplicate Entry',
      type : 'DUPLICATE'
    },
    DUPLICATE_ADDRESS: {
      statusCode:400,
      customMessage : 'Address Already Exist',
      type : 'DUPLICATE_ADDRESS'
    },
    UNIQUE_CODE_LIMIT_REACHED: {
      statusCode:400,
      customMessage : 'Cannot Generate Unique Code, All combinations are used',
      type : 'UNIQUE_CODE_LIMIT_REACHED'
    },
    INVALID_REFERRAL_CODE: {
      statusCode:400,
      customMessage : 'Invalid Referral Code',
      type : 'INVALID_REFERRAL_CODE'
    },
    FACEBOOK_ID_PASSWORD_ERROR: {
      statusCode:400,
      customMessage : 'Only one field should be filled at a time, either facebookId or password',
      type : 'FACEBOOK_ID_PASSWORD_ERROR'
    },
    INVALID_EMAIL: {
      statusCode:400,
      customMessage : 'Invalid Email Address',
      type : 'INVALID_EMAIL'
    },
    PASSWORD_REQUIRED: {
      statusCode:400,
      customMessage : 'Password is required',
      type : 'PASSWORD_REQUIRED'
    },
    INVALID_COUNTRY_CODE: {
      statusCode:400,
      customMessage : 'Invalid Country Code, Should be in the format +52',
      type : 'INVALID_COUNTRY_CODE'
    },
    INVALID_PHONE_NO_FORMAT: {
      statusCode:400,
      customMessage : 'Phone no. cannot start with 0',
      type : 'INVALID_PHONE_NO_FORMAT'
    },
    COUNTRY_CODE_MISSING: {
      statusCode:400,
      customMessage : 'You forgot to enter the country code',
      type : 'COUNTRY_CODE_MISSING'
    },
    INVALID_PHONE_NO: {
      statusCode:400,
      customMessage : 'Phone No. & Country Code does not match to which the OTP was sent',
      type : 'INVALID_PHONE_NO'
    },
    PHONE_NO_MISSING: {
      statusCode:400,
      customMessage : 'You forgot to enter the phone no.',
      type : 'PHONE_NO_MISSING'
    },
    NOTHING_TO_UPDATE: {
      statusCode:400,
      customMessage : 'Nothing to update',
      type : 'NOTHING_TO_UPDATE'
    },
    NOT_FOUND: {
      statusCode:400,
      customMessage : 'User Not Found',
      type : 'NOT_FOUND'
    },
    INVALID_RESET_PASSWORD_TOKEN: {
      statusCode:400,
      customMessage : 'Invalid Reset Password Token',
      type : 'INVALID_RESET_PASSWORD_TOKEN'
    },
    INCORRECT_PASSWORD: {
      statusCode:401,
      customMessage : 'Incorrect Password',
      type : 'INCORRECT_PASSWORD'
    },
    EMPTY_VALUE: {
      statusCode:400,
      customMessage : 'Empty String Not Allowed',
      type : 'EMPTY_VALUE'
    },
    PHONE_NOT_MATCH: {
      statusCode:400,
      customMessage : "Phone No. Doesn't Match",
      type : 'PHONE_NOT_MATCH'
    },
    SAME_PASSWORD: {
      statusCode:400,
      customMessage : 'Old password and new password are same',
      type : 'SAME_PASSWORD'
    },
    ACTIVE_PREVIOUS_SESSIONS: {
      statusCode:400,
      customMessage : 'You already have previous active sessions, confirm for flush',
      type : 'ACTIVE_PREVIOUS_SESSIONS'
    },
    EXTRA_ITEMS_PRICE_TYPE: {
      statusCode:400,
      customMessage : 'Invalid Extra Item, Price Should be Numeric On Row ',
      type : 'EXTRA_ITEMS_PRICE_TYPE'
    },
    SIZE_PRICE_TYPE: {
      statusCode:400,
      customMessage : 'Invalid Size Type, Price Should be Numeric On Row ',
      type : 'SIZE_PRICE_TYPE'
    },
    EXTRA_ITEMS_PRICE_MISSING: {
      statusCode:400,
      customMessage : 'Invalid Extra Item, Price Missing On Row ',
      type : 'EXTRA_ITEMS_PRICE_MISSING'
    },
    SIZE_PRICE_MISSING: {
      statusCode:400,
      customMessage : 'Invalid Size Type, Price Missing On Row ',
      type : 'SIZE_PRICE_MISSING'
    },
    EXTRA_SIZE_EN_NAME_DUPLICATE: {
      statusCode:400,
      customMessage : 'Duplicate Size Type English Name On Row ',
      type : 'EXTRA_SIZE_EN_NAME_DUPLICATE'
    },
    EXTRA_ITEMS_EN_NAME_DUPLICATE: {
      statusCode:400,
      customMessage : 'Duplicate Extra Item English Name On Row ',
      type : 'EXTRA_ITEMS_EN_NAME_DUPLICATE'
    },
    INVALID_EST_ID: {
      statusCode:400,
      customMessage : 'Invalid EstablishmentId',
      type : 'INVALID_EST_ID'
    },
    DUPLICATE_EXTRA_ID_VALUES: {
      statusCode:400,
      customMessage : 'Extra Array contains duplicate values',
      type : 'DUPLICATE_EXTRA_ID_VALUES'
    },
    DUPLICATE_SIZE_ID_VALUES: {
      statusCode:400,
      customMessage : 'Size Array contains duplicate values',
      type : 'DUPLICATE_SIZE_ID_VALUES'
    },
    EXTRA_IDS_NOT_FOUND: {
      statusCode:400,
      customMessage : 'Invalid Extra Ids',
      type : 'EXTRA_IDS_NOT_FOUND'
    },
    SIZE_IDS_NOT_FOUND: {
      statusCode:400,
      customMessage : 'Invalid Size Ids',
      type : 'SIZE_IDS_NOT_FOUND'
    },
    EXTRA_ITEMS_MX_NAME_DUPLICATE: {
      statusCode:400,
      customMessage : 'Duplicate Extra Item Spanish Name On Row ',
      type : 'EXTRA_ITEMS_MX_NAME_DUPLICATE'
    },
    SIZE_TYPE_MX_NAME_DUPLICATE: {
      statusCode:400,
      customMessage : 'Duplicate Size Type Spanish Name On Row ',
      type : 'SIZE_TYPE_MX_NAME_DUPLICATE'
    },
    EXTRA_ITEMS_EN_NAME_MISSING: {
      statusCode:400,
      customMessage : 'Invalid Extra Item, English Name Missing On Row ',
      type : 'EXTRA_ITEMS_EN_NAME_MISSING'
    },
    SIZE_TYPE_EN_NAME_MISSING: {
      statusCode:400,
      customMessage : 'Invalid Size Type, English Name Missing On Row ',
      type : 'SIZE_TYPE_EN_NAME_MISSING'
    },
    EXTRA_ITEMS_MX_NAME_MISSING: {
      statusCode:400,
      customMessage : 'Invalid Extra Item, Spanish Name Missing On Row ',
      type : 'EXTRA_ITEMS_MX_NAME_MISSING'
    },
    SIZE_TYPE_MX_NAME_MISSING: {
      statusCode:400,
      customMessage : 'Invalid Size Type, Spanish Name Missing On Row ',
      type : 'SIZE_TYPE_MX_NAME_MISSING'
    },
    EXTRA_ITEMS_ALPHANUMERIC: {
      statusCode:400,
      customMessage : 'Invalid Extra Item, Alphanumeric Name should be on row ',
      type : 'EXTRA_ITEMS_ALPHANUMERIC'
    },
    EXTRA_ITEMS_LENGTH: {
      statusCode:400,
      customMessage : 'Invalid Extra Item, Min length 2 should be on row ',
      type : 'EXTRA_ITEMS_LENGTH'
    },
    SIZE_TYPE_LENGTH: {
      statusCode:400,
      customMessage : 'Invalid Size Type, Min length 2 should be on row ',
      type : 'SIZE_TYPE_LENGTH'
    },
    INVALID_EXTRA_ITEMS: {
      statusCode:400,
      customMessage : 'Invalid Extra Items Array Data',
      type : 'INVALID_EXTRA_ITEMS'
    },
    INVALID_SIZE_TYPES: {
      statusCode:400,
      customMessage : 'Invalid Size Types Array Data',
      type : 'INVALID_SIZE_TYPES'
    },
    EMAIL_ALREADY_EXIST: {
      statusCode:400,
      customMessage : 'Email Address Already Exists',
      type : 'EMAIL_ALREADY_EXIST'
    },
    ERROR_PROFILE_PIC_UPLOAD: {
      statusCode:400,
      customMessage : 'Profile pic is not a valid file',
      type : 'ERROR_PROFILE_PIC_UPLOAD'
    },
    PHONE_ALREADY_EXIST: {
      statusCode:400,
      customMessage : 'Phone No. Already Exists',
      type : 'PHONE_ALREADY_EXIST'
    },
    EMAIL_NOT_FOUND: {
      statusCode:400,
      customMessage : 'Email Not Found',
      type : 'EMAIL_NOT_FOUND'
    },
    FACEBOOK_ID_NOT_FOUND: {
      statusCode:400,
      customMessage : 'Facebook Id Not Found',
      type : 'FACEBOOK_ID_NOT_FOUND'
    },
    PHONE_NOT_FOUND: {
      statusCode:400,
      customMessage : 'Phone No. Not Found',
      type : 'PHONE_NOT_FOUND'
    },
    INCORRECT_OLD_PASS: {
      statusCode:400,
      customMessage : 'Incorrect Old Password',
      type : 'INCORRECT_OLD_PASS'
    },
    UNAUTHORIZED: {
      statusCode:401,
      customMessage : 'You are not authorized to perform this action',
      type : 'UNAUTHORIZED'
    }

  },
  SUCCESS: {
    CREATED: {
      statusCode:201,
      customMessage : 'Created Successfully',
      type : 'CREATED'
    },
    DEFAULT: {
      statusCode:200,
      customMessage : 'Success',
      type : 'DEFAULT'
    },
    UPDATED: {
      statusCode:200,
      customMessage : 'Updated Successfully',
      type : 'UPDATED'
    },
    LOGOUT: {
      statusCode:200,
      customMessage : 'Logged Out Successfully',
      type : 'LOGOUT'
    },
    DELETED: {
      statusCode:200,
      customMessage : 'Deleted Successfully',
      type : 'DELETED'
    }
  }
};


const swaggerDefaultResponseMessages = [
  {code: 200, message: 'OK'},
  {code: 400, message: 'Bad Request'},
  {code: 401, message: 'Unauthorized'},
  {code: 404, message: 'Data Not Found'},
  {code: 500, message: 'Internal Server Error'}
];

const SCREEN_TO_SHOW = {
  HOMEPAGE : 'HOMEPAGE',
  TRACKING : 'TRACKING',
  FEEDBACK : 'FEEDBACK'
};




const APP_CONSTANTS = {
  SERVER: SERVER,
  DATABASE: DATABASE,
  SCREEN_TO_SHOW : SCREEN_TO_SHOW,
  STATUS_MSG: STATUS_MSG,
  swaggerDefaultResponseMessages: swaggerDefaultResponseMessages
};

module.exports = APP_CONSTANTS;