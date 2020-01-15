class HomeController {
  async index (req, res) {
    res.status(200)
      .render('home/index')
  }
}

module.exports = new HomeController()
