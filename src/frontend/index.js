const Router = require('express').Router()
const homeRoutes = require('./home/routes')
const loggedRoutes = require('./logged/routes')

const routes = Router
  .use('/', homeRoutes)
  .use('/logged', loggedRoutes)

module.exports = routes
