const crypto = require('crypto')
const Dropbox = require('dropbox').Dropbox
const fetch = require('isomorphic-fetch')

const {
  DROPBOX_APP_KEY,
  DROPBOX_APP_SECRET,
  DROPBOX_APP_REDIRECT_URI } = process.env

// Dropbox configuration
const dbx = new Dropbox({
  fetch,
  clientId: DROPBOX_APP_KEY,
  clientSecret: DROPBOX_APP_SECRET
})

class AuthController {
  async store (req, res) {
    let { state, code } = req.query
    let { login } = req.session

    if (state && code) {
      let token = login
        ? login.token
        : null;

      try {
        if (!token) {
          // store token and invalidate state
          token = await dbx.getAccessTokenFromCode(DROPBOX_APP_REDIRECT_URI, code)

          dbx.setAccessToken(token)

          req.session.login = {
            ...login,
            token
          }
        }

        const {
          name: { display_name },
          email,
          account_id,
          email_verified,
          profile_photo_url
        } = await dbx.usersGetCurrentAccount()

        return res.status(200)
          .render('auth/index', {
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

        return res.status(200)
          .render('ops/index', {
            message: msg
          })
      }
    }

    // create a random hash value
    state = crypto.randomBytes(16).toString('hex')

    // get authentication URL and redirect
    const authUrl = dbx.getAuthenticationUrl(DROPBOX_APP_REDIRECT_URI, state, 'code')

    req.session.login = {
      id: req.session.id,
      state
    }

    res.redirect(authUrl)
  }

  async destroy (req, res) { }
}

module.exports = new AuthController()
