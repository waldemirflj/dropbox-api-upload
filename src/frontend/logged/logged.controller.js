const {
  DROPBOX_APP_FOLDER
} = process.env

const fetch = require('isomorphic-fetch')
const Dropbox = require('dropbox').Dropbox

class LoggedController {
  async index (req, res) {
    const { token } = req.session

    if (!token) {
      return res.redirect('/')
    }

    try {
      const dbx = new Dropbox({
        fetch,
        accessToken: token
      })

      await dbx.filesCreateFolderBatch({
        paths: [`/${DROPBOX_APP_FOLDER}`],
        autorename: false,
        force_async: false
      })

      const {
        name: { display_name },
        email,
        account_id,
        email_verified,
        profile_photo_url
      } = await dbx.usersGetCurrentAccount()

      const { entries } = await dbx.filesListFolder({ path: `/${DROPBOX_APP_FOLDER}` })

      const files = entries.map(({ id, name }) => ({
        id,
        name
      }))

      res.render('logged/index', {
        email,
        account_id,
        display_name,
        email_verified,
        profile_photo_url,
        files
      })
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

module.exports = new LoggedController()
