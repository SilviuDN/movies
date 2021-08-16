const router = require("express").Router();

const celebritiesRouter = require('./celebrities.routes')
const moviesRouter = require('./movies.routes')

router.use('/celebrities', celebritiesRouter)

router.use('/movies', moviesRouter)

router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
