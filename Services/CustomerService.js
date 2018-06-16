'use strict';

var Models = require('../Models');

//Get Users from DB
const getCustomer = function (criteria, projection, options, callback) {
    Models.Customers.find(criteria, projection, options, callback);
};





//Insert User in DB
const createCustomer = function (objToSave, callback) {
    new Models.Customers(objToSave).save(callback)
};

//Update User in DB
const updateCustomer = function (criteria, dataToSet, options, callback) {
    Models.Customers.findOneAndUpdate(criteria, dataToSet, options, callback);
};

//Delete User in DB
const deleteCustomer = function (criteria, callback) {
    Models.Customers.findOneAndRemove(criteria, callback);
};


module.exports = {
    getCustomer: getCustomer,
    updateCustomer: updateCustomer,
    deleteCustomer: deleteCustomer,
    createCustomer: createCustomer
};

