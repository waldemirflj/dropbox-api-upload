const Router = require('express').Router()
const uploadsRoutes = require('./uploads/routes')

const routes = Router
  .use('/uploads', uploadsRoutes)


module.exports = routes
