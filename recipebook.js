const express = require('express')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const { credentials } = require('./config')
const csrf = require('csurf')
const path = require('path')
const handlebars = require('express-handlebars').create({ // create handlebars object
    helpers: { // functions you can call in a handlebars tag thing using Polish notation
      eq: (v1, v2) => v1 == v2,
      ne: (v1, v2) => v1 != v2,
      lt: (v1, v2) => v1 < v2,
      gt: (v1, v2) => v1 > v2,
      lte: (v1, v2) => v1 <= v2,
      gte: (v1, v2) => v1 >= v2,
      and() {
          return Array.prototype.every.call(arguments, Boolean);
      },
      or() {
          return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
      },
      someId: (arr, id) => arr && arr.some(obj => obj.id == id),
      in: (arr, obj) => arr && arr.some(val => val == obj),
      dateStr: (v) => v && v.toLocaleDateString("en-US")
    }
  });
const bodyParser = require('body-parser')