const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Config = require('../Config');

const Customers = new Schema({
    name: {type: String, trim: true, index: true, default: null, sparse: true},
    countryCode: {type: String, required: true, trim: true, min:2, max:5},
    phoneNo: {type: String, required: true, trim: true, index: true, unique: true, min: 10, max: 15},
    newNumber: {type: String, trim: true, sparse: true, index: true, unique: true, min: 10, max: 15},
    email: {type: String, trim: true, unique: true, index: true, required: true},
    codeUpdatedAt: {type: Date, default: Date.now, required: true},
    firstTimeLogin: {type: Boolean, default: false},
    language: {
        type: String, required: true,
        default : Config.APP_CONSTANTS.DATABASE.LANGUAGE.ES_MX,
        enum: [
            Config.APP_CONSTANTS.DATABASE.LANGUAGE.EN,
            Config.APP_CONSTANTS.DATABASE.LANGUAGE.ES_MX
        ]
    },
    password: {type: String},
    passwordResetToken: {type: String, trim: true, unique: true, index: true, sparse: true},
    registrationDate: {type: Date, default: Date.now, required: true},
    appVersion: {type: String},
    OTPCode: {type: String, trim: true, unique: true, sparse: true, index: true},
    accessToken: {type: String, trim: true, index: true, unique: true, sparse: true},
    emailVerificationToken: {type: String, trim: true, index: true, unique: true, sparse: true},
    deviceToken: {type: String, trim: true, index: true, unique: true, sparse: true},
    deviceType: {
        type: String, enum: [
            Config.APP_CONSTANTS.DATABASE.DEVICE_TYPES.IOS,
            Config.APP_CONSTANTS.DATABASE.DEVICE_TYPES.ANDROID
        ]
    },
    isBlocked: {type: Boolean, default: false, required: true},
    emailVerified: {type: Boolean, default: false, required: true},
    phoneVerified: {type: Boolean, default: false, required: true},
    currentLocation: {type: [Number], index: '2d'},
    defaultAddressId : {type: String, default:null},
    profilePicURL: {
        original: {type: String, default: null},
        thumbnail: {type: String, default: null}
    }
});

Customers.index({'currentLocation.coordinates': "2d"});


module.exports = mongoose.model('Customers', Customers);