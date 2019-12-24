var express = require('express');
var router = express.Router();
const Cookies = require('cookies');

const trackingIdKey = 'tracking_id';

var User = require('../models/user');

router.get('/', function(req, res, next) {
  const cookies = new Cookies(req, res);
  
  if(!cookies.get(trackingIdKey)){ 
    const trackingId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    const oneWeek = new Date(Date.now() + (1000 * 60 * 60 * 24 * 7));
    cookies.set(trackingIdKey, trackingId, { expires: oneWeek });
    res.render('index', { 
      title: 'Are You a Werewolf?',
      user: req.user,
      cookie_Id: cookies.get(trackingIdKey)
     });
  } else if(cookies.get(trackingIdKey)){
    const addWeek = new Date(Date.now() + (1000 * 60 * 60 * 24 * 7));
    const userCookie = cookies.get(trackingIdKey);
    cookies.set(trackingIdKey, userCookie, { expires: addWeek });
    User.findOne({
      where:{
        userId:cookies.get(trackingIdKey)
      }
    }).then((data) => {
      res.render('index', { 
        title: 'Are You a Werewolf?',
        user: req.user,
        cookie_Id: cookies.get(trackingIdKey),
        username:data
       });
    })
  } else {
    const err = new Error('cookie機能のエラー');
    err.status = 400;
    next(err);
  }
});

router.post(`/nickname/:cookieID`,(req,res,next) => {
  const cookieId = req.params.cookieID;
  User.upsert({
    userId: cookieId,
    username:"クッキー利用者",
    displayname: req.body.inputValue
  }).then(() => {
    res.json({ status: 'OK', displayname: req.body.inputValue });
  });
})

module.exports = router;
