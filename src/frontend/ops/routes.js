const Router = require('express').Router()
const controller = require('./ops.controller')

const routes = Router
  .get('/', controller.index)

module.exports = routes
