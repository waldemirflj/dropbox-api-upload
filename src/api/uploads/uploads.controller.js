const { UPLOADS_DIR } = process.env

const mv = require('mv')
const path = require('path')
const crypto = require('crypto')
const formidable = require('formidable')

class UploadsController {
  async store (req, res) {
    const form = new formidable.IncomingForm()

    form.parse(req, (error, fields, files) => {
      if (error) {
        const { message } = error

        return res.status(200)
          .render('ops/index', {
            message
          })
      }

      const tmp = files.file.path
      const fileName = crypto.randomBytes(16).toString('hex')
      const fileExtensio = files.file.name.split('.')[1]
      const fileDir = path.join(UPLOADS_DIR, `${fileName}.${fileExtensio}`)

      mv(tmp, fileDir, (error) => {
        if (error) {
          const { message } = error

          return res.status(200)
            .render('ops/index', {
              message
            })
        }

        res.status(200)
          .redirect('/auth')
      })
    })
  }
}

module.exports = new UploadsController()
