var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a Very Nice and awesome routes');
});

module.exports = router;
