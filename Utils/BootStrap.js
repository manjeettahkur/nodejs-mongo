'use strict';

const mongoose = require('mongoose');
const Config = require('../Config');




mongoose.connect(Config.dbConfig.mongo.URI, err => {
  console.log(err)
   if (err) process.exit(1); else console.log('MongoDB Connected')
})


