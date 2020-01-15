require('dotenv').config()

const { PORT, NODE_ENV } = process.env
const server = require('./src/express')

server
  .listen(PORT, () => {
    console.info(`server is running in ${NODE_ENV}: ${new Date()}`)
  })
