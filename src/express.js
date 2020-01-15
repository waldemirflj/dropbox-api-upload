const path = require('path')
const express = require('express')
const routes = require('./routes')
const session = require('express-session')

const { SESSION_SECRET } = process.env

const server = express()
  .set('view engine', 'ejs')
  .set('views', path.join(__dirname, 'views'))
  .use(session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    maxAge: 3600000
  }))
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(routes)

module.exports = server
