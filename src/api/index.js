const Router = require('express').Router()
const authRoutes = require('./auth/routes')
const uploadsRoutes = require('./uploads/routes')

const routes = Router
  .use('/auth', authRoutes)
  .use('/uploads', uploadsRoutes)


module.exports = routes
