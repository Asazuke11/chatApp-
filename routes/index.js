var express = require('express');
var router = express.Router();
const Cookies = require('cookies');
const Title_Name = 'Are You a Werewolf?';
const subTitle_Name = 'ONE NIGHT WEREWOLF version';
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

  addTrackingCookie(cookies)
  upsert_expires(cookies);
  pugRender(cookies);

  function addTrackingCookie(cookies) {
    if (!cookies.get(trackingIdKey)) {
      const Cookie_ID = require('crypto').randomBytes(8).toString('hex');
      const Plus7day = Date.now() + (1000 * 60 * 60 * 24 * 7);
      const Plus7day_new_Date = new Date(Plus7day);
      cookies.set(trackingIdKey, Cookie_ID, { expires: Plus7day_new_Date });
      User.upsert({
        userId: Cookie_ID,
        username: "ななしの村人",
        expires: Plus7day
      });
    };
  };

  function upsert_expires(cookies) {
    if (cookies.get(trackingIdKey)) {
      const Cookie_ID = cookies.get(trackingIdKey);
      const Plus3day = Date.now() + (1000 * 60 * 60 * 24 * 3);
      const Plus3day_new_Date = new Date(Plus3day);
      cookies.set(trackingIdKey, Cookie_ID, { expires: Plus3day_new_Date });
      User.upsert({
        userId: Cookie_ID,
        expires: Plus3day
      });
    };
  };

  function pugRender(cookies) {
    if (cookies.get(trackingIdKey)) {
      User.findOne({
        where: {
          userId: cookies.get(trackingIdKey)
        }
      })
        .then((database_data) => {
          res.render('index', {
            title: Title_Name,
            subtitle: subTitle_Name,
            database_data: database_data
          });
        })
    };
    if (!cookies.get(trackingIdKey)) {
      res.render('index', {
        title: Title_Name,
        subtitle: subTitle_Name
      });
    };
  };


});　//〆router.get

router.post(`/username/:cookieID`, (req, res, next) => {
  User.upsert({
    userId: req.params.cookieID,
    picURL: req.body.chaURL,
    username: req.body.input_Value
  }).then(() => {
    res.json({
      status: 'OK',
      picURL: req.body.chaURL,
      username: req.body.input_Value
    });
  });
})

module.exports = router;