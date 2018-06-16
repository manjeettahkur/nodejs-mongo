'use strict';

const Controller = require('../Controllers');
const UniversalFunctions = require('../Utils/UniversalFunctions');
const APP_CONSTANTS = require('../Config/appConstants')
const Joi = require('joi');


module.exports = [
    {
        method: 'POST',
        path: '/api/customer/register',
        handler: function (request, reply) {
            let payloadData = request.payload;
               Controller.CustomerController.createCustomer(payloadData, function (err, data) {
                if (err) {
                    reply(UniversalFunctions.sendError(err));
                } else {
                    reply(UniversalFunctions.sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.CREATED, data)).code(201)
                }
            });
        },
        config: {
            description: 'Register Customer',
            tags: ['api', 'customer'],
            validate: {
                payload: {
                    name: Joi.string().regex(/^[a-zA-Z ]+$/).trim().min(2).required(),
                    countryCode: Joi.string().max(4).required().trim(),
                    phoneNo: Joi.string().regex(/^[0-9]+$/).min(5).required(),
                    email: Joi.string().email().required(),
                    password: Joi.string().required().min(5).trim()
                },
                failAction: UniversalFunctions.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                    payloadType : 'form',
                    responseMessages: APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/api/customer/login',
        handler: function (request, reply) {
            let payloadData = request.payload;
            Controller.CustomerController.loginCustomer(payloadData, function (err, data) {
                if (err) {
                    reply(UniversalFunctions.sendError(err));
                } else {
                    reply(UniversalFunctions.sendSuccess(null, data))
                }
            });
        },
        config: {
            description: 'Login Via Email & Password For  Customer',
            tags: ['api', 'customer'],
            validate: {
                payload: {
                    email: Joi.string().email().required(),
                    password: Joi.string().required().min(5).trim(),
                    flushPreviousSessions: Joi.boolean().required()
                },
                failAction: UniversalFunctions.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                    responseMessages: APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },

    {
        method: 'PUT',
        path: '/api/customer/logout',
        handler: function (request, reply) {
            let userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;

                Controller.CustomerController.logoutCustomer(userData, function (err, data) {
                    if (err) {
                        reply(UniversalFunctions.sendError(err));
                    } else {
                        reply(UniversalFunctions.sendSuccess())
                    }
                });

        },
        config: {
            auth: 'UserAuth',
            validate: {
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction
            },
            description: 'Logout Customer',
            tags: ['api', 'customer'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },

];