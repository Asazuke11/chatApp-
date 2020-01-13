var express = require('express');
var router = express.Router();
const Cookies = require('cookies');
const trackingIdKey = 'tracking_id';
const uuid = require('uuid');
var User = require('../models/user');
var Room = require('../models/room');

router.get('/:roomId', (req, res, next) => {
  const cookies = new Cookies(req, res);
  const Cookie_ID = cookies.get(trackingIdKey);
  User.findOne({
    where: {
      userId: Cookie_ID
    }
  }).then((database_data) => {
    Room.findOne({
      where:{
        createdBy:database_data.userId
      }
    }).then((room_data) => {
      if(room_data){
        res.render('room', {
          room_data: room_data,
          database_data: database_data,
          roomId: req.params.roomId
        });
      }else{
        res.render('room', {
          database_data: database_data,
          roomId: req.params.roomId
        });
      }
    })
  });
});

router.post(`/new`, (req, res, next) => {
  const roomId = uuid.v4();
  const user_cookie = req.body.user_cookieId;
  const user_name = req.body.user_name;
  let room_coment = req.body.roommemo;
  if (!room_coment) {
    room_coment = "誰でもOK";
  }
  Room.upsert({
    roomId: roomId,
    roomMemo: room_coment,
    inRoomNow: 0,
    createdBy: user_cookie,
    userName:user_name
  }).then(() => {
    res.redirect(`/room/${roomId}`);
  });
});

module.exports = router;