const fetch = require('isomorphic-fetch')
const Dropbox = require('dropbox').Dropbox

class ShareController {
  async store (req, res) {
    const { token } = req.session
    const { email, file } = req.body

    try {
      const dbx = new Dropbox({
        fetch,
        accessToken: token
      })

      const members = [{
        email,
        '.tag': 'email'
      }]

      await dbx.sharingAddFileMember({
        file,
        members,
        access_level: 'viewer',
        custom_message: 'Dropbox API Upload',
      })

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

module.exports = new ShareController()
