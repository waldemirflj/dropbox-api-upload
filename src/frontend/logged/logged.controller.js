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

      const {
        name: { display_name },
        email,
        account_id,
        email_verified,
        profile_photo_url
      } = await dbx.usersGetCurrentAccount()

      res.render('logged/index', {
        email,
        account_id,
        display_name,
        email_verified,
        profile_photo_url
      })
    } catch (err) {
      const { message, error } = err
      const msg = message
        ? message
        : error.error_description

      res.render('ops/index', {
        message: msg
      })
    }
  }
}

module.exports = new LoggedController()
