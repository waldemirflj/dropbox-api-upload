const Router = require('express').Router()
const controller = require('./logged.controller')

const routes = Router
  .get('/', controller.index)

module.exports = routes
