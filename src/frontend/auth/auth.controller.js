const crypto = require('crypto')
const Dropbox = require('dropbox').Dropbox
const fetch = require('isomorphic-fetch')

const { DROPBOX_APP_KEY, DROPBOX_APP_SECRET } = process.env

// Redirect URL to pass to Dropbox. Has to be whitelisted in Dropbox settings
const REDIRECT_URL='http://localhost:3000/auth'

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
          token = await dbx.getAccessTokenFromCode(REDIRECT_URL, code)

          dbx.setAccessToken(token)

          req.session.login = {
            ...login,
            token
          }
        }

        const {
          name: { display_name },
          teste,
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
      } catch (error) {
        const { message } = error
        req.flash('errorMessage', message)

        return res.status(200)
          .render('ops/index', {
            message
          })
      }
    }

    // create a random hash value
    state = crypto.randomBytes(16).toString('hex')

    // get authentication URL and redirect
    const authUrl = dbx.getAuthenticationUrl(REDIRECT_URL, state, 'code')

    req.session.login = {
      id: req.session.id,
      state
    }

    res.redirect(authUrl)
  }

  async destroy (req, res) { }
}

module.exports = new AuthController()
