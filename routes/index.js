var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Joker' });
// });

module.exports = function (app) {
  app.get('/', function (req, res) {
    res.render('index');
  });
  app.get('about', function (req, res) {
    res.render('about');
  });
}
