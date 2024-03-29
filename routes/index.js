var express = require('express');
var router = express.Router();
const Cookies = require('cookies');
const Title_Name = '人狼ゲーム支援あぷり。';
const subTitle_Name = 'Webアプリコンテスト 2019 冬';
const trackingIdKey = 'tracking_id';
var User = require('../models/user');

router.get('/', function (req, res, next) {

  const cookies = new Cookies(req, res);

  addTrackingCookie(cookies)
  upsert_expires(cookies);

  function addTrackingCookie(cookies) {
    if (!cookies.get(trackingIdKey)) {
      const Cookie_ID = require('crypto').randomBytes(8).toString('hex');
      const tomorrow = new Date(Date.now() + (1000 * 60 * 60 * 24));
      cookies.set(trackingIdKey, Cookie_ID, { expires: tomorrow });
      User.upsert({
        userId: Cookie_ID,
        username: "ななしの村人",
        picURL: "s-f043.png"
      }).then(() => {
        User.findOne({
          where: {
            userId: Cookie_ID
          }
        }).then((database_data) => {
          res.render('index', {
            title: Title_Name,
            subtitle: subTitle_Name,
            database_data: database_data
          });
        });
      });
    };
  };

  function upsert_expires(cookies) {
    if (cookies.get(trackingIdKey)) {
      const Cookie_ID = cookies.get(trackingIdKey);
      User.findOne({
        where: {
          userId: Cookie_ID
        }
      }).then((database_data) => {
        res.render('index', {
          title: Title_Name,
          subtitle: subTitle_Name,
          database_data: database_data
        });
      });
    };
  }
});

module.exports = router;