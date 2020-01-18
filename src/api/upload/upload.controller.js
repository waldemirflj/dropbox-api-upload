const {
  UPLOADS_DIR,
  DROPBOX_APP_FOLDER
} = process.env

const fs = require('fs')
const path = require('path')
const fetch = require('isomorphic-fetch')
const Dropbox = require('dropbox').Dropbox
const formidable = require('formidable')

class UploadsController {
  async store (req, res) {
    const { token } = req.session

    const form = new formidable.IncomingForm({
      uploadDir: UPLOADS_DIR,
      keepExtensions: true
    })

    const upload = new Promise((resolve, reject) => {
      form.parse(req, (error, fields, files) => {
        if (error) {
          reject(error)
        }

        const { folder } = fields
        const { path } = files.file
        const file = path.split('/').pop()

        resolve({
          file,
          folder
        })
      })
    })

    try {
      const { file, folder } = await upload
      const fileDir = path.join(UPLOADS_DIR, file)
      const fileContent = fs.readFileSync(fileDir)

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
        is_downloadable } = await dbx.filesUpload({ path: `${folder}/${file}`, contents: fileContent })

      res.redirect('/logged')
    } catch (err) {
      const { message, error } = err
      const msg = message
        ? message
        : error

      res.render('ops/index', {
        message: msg
      })
    }
  }
}

module.exports = new UploadsController()
