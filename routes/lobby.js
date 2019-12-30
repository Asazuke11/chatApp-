var express = require('express');
var router = express.Router();
const Cookies = require('cookies');
const trackingIdKey = 'tracking_id';

var User = require('../models/user');
/*
  userId:
  picURL:
  username:
  expires:
*/

router.get('/', function (req, res, next) {

  const cookies = new Cookies(req, res);
  pugRender(cookies);

  function pugRender(cookies) {
    if (!cookies.get(trackingIdKey)) {res.redirect('/');};
    if (cookies.get(trackingIdKey)) {
      User.findOne({
        where: {
          userId: cookies.get(trackingIdKey)
        }
      })
        .then((database_data) => {
          res.render('lobby', {
            database_data
          });
        })
    };
  };


});　//〆router.get

module.exports = router;