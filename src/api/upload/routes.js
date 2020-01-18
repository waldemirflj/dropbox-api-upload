const Router = require('express').Router()
const controller = require('./upload.controller')

const routes = Router
  .post('/', controller.store)

module.exports = routes
