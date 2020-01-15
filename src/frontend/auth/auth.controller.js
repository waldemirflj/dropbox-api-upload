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
      let token;

      try {
        if (!login.token) {
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
      } catch (error) {
        res.redirect('/ops')
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
}

module.exports = new AuthController()
