var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', function (req, res, next) {
  res.render('Roby/Roby-index', {});
});

router.get('/test', function (req, res, next) {
  res.render('Roby/Play-area copy', {});
});


router.post('/login', passport.authenticate('local',
  {
    successRedirect: '/rooma',
    failureRedirect: '/roby',
    session: true
  })
);

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;