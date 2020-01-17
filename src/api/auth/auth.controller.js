const {
  DROPBOX_APP_KEY,
  DROPBOX_APP_SECRET,
  DROPBOX_APP_REDIRECT_URI } = process.env

const fetch = require('isomorphic-fetch')
const crypto = require('crypto')
const Dropbox = require('dropbox').Dropbox

const dbx = new Dropbox({
  fetch,
  clientId: DROPBOX_APP_KEY,
  clientSecret: DROPBOX_APP_SECRET
})

class AuthController {
  async store (req, res) {
    let { state, code } = req.query

    try {
      if (!state && !code) {
        state = crypto.randomBytes(16).toString('hex')
        const redirect = dbx.getAuthenticationUrl(DROPBOX_APP_REDIRECT_URI, state, 'code')
        return res.redirect(redirect)
      }

      const token = await dbx.getAccessTokenFromCode(DROPBOX_APP_REDIRECT_URI, code)

      req.session.token = token
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

  async destroy (req, res) { }
}

module.exports = new AuthController()
