require('dotenv').config()
const path = require('path')

process.env.UPLOADS_DIR = path.join(__dirname, './upload')
process.env.DOWNLOADS_DIR = path.join(__dirname, './upload')

const { PORT, NODE_ENV } = process.env
const server = require('./src/express')

server
  .listen(PORT, () => {
    console.info(`server is running in ${NODE_ENV}: ${new Date()}`)
  })
