const Router = require('express').Router()
const homeRoutes = require('./home/routes')
const authRoutes = require('./auth/routes')
const opsRoutes = require('./ops/routes')

const routes = Router
  .use('/', homeRoutes)
  .use('/auth', authRoutes)
  .use('/ops', opsRoutes)

module.exports = routes
