const Router = require('express').Router()
const controller = require('./uploads.controller')

const routes = Router
  .post('/', controller.store)

module.exports = routes
