const Router = require('express').Router()
const controller = require('./auth.controller')

const routes = Router
  .get('/', controller.store)

module.exports = routes
