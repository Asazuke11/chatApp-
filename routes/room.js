var express = require('express');
var router = express.Router();
const uuid = require('uuid');
// var User = require('../models/user');
/*
  userId:
  picURL:
  username:
  expires:
*/

var Room = require('../models/room');
/*
  roomId:
  roomMemo:
  inRoomNow:
  updatedAt:
  createdBy:
*/
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
    inRoomNow: 1,
    createdBy: user_cookie,
    username: user_name
  }).then((database) => {
    res.render('room', {
      database
    });
  });
});

module.exports = router;