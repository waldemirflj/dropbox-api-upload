const Router = require('express').Router()
const controller = require('./share.controller')

const routes = Router
  .post('/', controller.store)

module.exports = routes
