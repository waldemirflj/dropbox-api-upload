const Router = require('express').Router()
const frontend = require('./frontend')

const routes = Router
  .use('/', frontend)

module.exports = routes
