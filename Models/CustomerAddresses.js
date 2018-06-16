var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Config = require('../Config');

var customerAddresses = new Schema({
    customer: {type: Schema.ObjectId, ref: 'Customers', required: true},
    locationLongLat: {type: [Number], index: '2d', default: [0, 0], required: true},
    streetAddress: {type: String, default: null, trim: true, required: true},
    city: {type: String, default: null, trim: true, required: true},
    nickName: {type: String, trim: true, required: true},
    apartmentSuite: {type: String, default:null, trim: true, required: true},
    state: {type: String, default: null, trim: true, required: true},
    country: {type: String, default: null, trim: true, required: true},
    zip: {type: String, default: null, trim: true, required: true},
    directionDetails: {type: String, default: null, trim: true},
    isDeleted : {type : Boolean, default:false}
});

customerAddresses.index({customer: 1, streetAddress: 1, city: 1, state: 1, country: 1, zip: 1, isDeleted:1}, {unique: true});

module.exports = mongoose.model('customerAddresses', customerAddresses);