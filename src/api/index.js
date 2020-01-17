const Router = require('express').Router()
const authRoutes = require('./auth/routes')
const shareRoutes = require('./share/routes')
const uploadRoutes = require('./upload/routes')

const routes = Router
  .use('/auth', authRoutes)
  .use('/share', shareRoutes)
  .use('/upload', uploadRoutes)


module.exports = routes
