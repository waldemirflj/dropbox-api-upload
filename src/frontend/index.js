const Router = require('express').Router()
const homeRoutes = require('./home/routes')
const authRoutes = require('./auth/routes')

const routes = Router
  .use('/', homeRoutes)
  .use('/auth', authRoutes)

module.exports = routes
