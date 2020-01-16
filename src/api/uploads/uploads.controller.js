const {
  UPLOADS_DIR,
  DOWNLOADS_DIR,
  DROPBOX_APP_KEY,
  DROPBOX_APP_SECRET } = process.env

const mv = require('mv')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const formidable = require('formidable')
const Dropbox = require('dropbox').Dropbox
const fetch = require('isomorphic-fetch')

class UploadsController {
  async store (req, res) {
    const { login: { token } } = req.session

    const form = new formidable.IncomingForm()
    const upload = new Promise((resolve, reject) => {
      form.parse(req, (error, fields, files) => {
        if (error) {
          reject(error)
        }

        const tmp = files.file.path
        const fileName = crypto.randomBytes(16).toString('hex')
        const fileExtensio = files.file.name.split('.')[1]
        const fileDir = path.join(UPLOADS_DIR, `${fileName}.${fileExtensio}`)

        mv(tmp, fileDir, (error) => {
          if (error) {
            reject(error)
          }
        })

        resolve(`${fileName}.${fileExtensio}`)
      })
    })

    try {
      const fileName = await upload
      const fileDir = path.join(UPLOADS_DIR, fileName)
      const fileContent = fs.createReadStream(fileDir)

      const dbx = new Dropbox({
        fetch,
        accessToken: token
      })

      const {
        id,
        rev,
        size,
        name,
        path_lower,
        path_display,
        content_hash,
        client_modified,
        server_modified,
        is_downloadable } = await dbx.filesUpload({ path: `/${fileName}`, contents: fileContent })

      res.redirect('/')
    } catch (error) {
      const { message } = error

      res.status(200)
        .render('ops/index', {
          message
        })
    }
  }
}

module.exports = new UploadsController()
