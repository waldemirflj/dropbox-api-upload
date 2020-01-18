const path = require('path')
const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const routes = require('./routes')

const {
  NODE_ENV,
  PUBLIC_DIR,
  COOKIE_SECRET,
  SESSION_SECRET } = process.env

const server = express()
  .set('view engine', 'ejs')
  .set('views', path.join(__dirname, 'views'))
  .use(express.static(PUBLIC_DIR))
  .use(cookieParser(COOKIE_SECRET))
  .use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      cookie: { secure: NODE_ENV === 'production' }
    }
  }))
  .use(express.urlencoded({ extended: false }))
  .use(express.json())
  .use(routes)

module.exports = server
