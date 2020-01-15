class OpsController {
  async index (req, res) {
    res.status(200)
      .render('ops/index', {
        message: 'Ops...'
      })
  }
}

module.exports = new OpsController()
