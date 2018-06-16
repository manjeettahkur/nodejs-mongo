'use strict'


const HapiSwagger = require('hapi-swagger')
const Inert = require('inert')
const Vision = require('vision')


// Register Swagger
const Pack = require('../package')

exports.register = (server, options, next) => {
  server.register([
    Inert,
    Vision,
    {
      'register': HapiSwagger,
      'options': {
        'info': {
          'title': `API Documentation for DEV environment`,
          'version': '1.0'
          // 'description':'Please use "accept :application/vnd.easyme.version.v1+json" for api versioning'
        },
        'schemes': ['http'],
        'pathPrefixSize': 2,
        'basePath': '/',
        documentationPath: '/doc',
        debug: true
      }
    }], (err) => {
    if (err) {
      server.log(['error'], `hapi-swagger load error: ${err}`)
    } else {
      server.log(['start'], 'hapi-swagger interface loaded')
    }
  })
  next()
}

exports.register.attributes = {
  name: 'swagger-plugin'
}
