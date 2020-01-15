const Router = require('express').Router()
const controller = require('./auth.controller')

const routes = Router
  .get('/', controller.store)
  .get('/logout', controller.destroy)

module.exports = routes
