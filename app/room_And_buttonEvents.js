"use strict";
const local_modules = require("./local-modules");
const $ = local_modules.$;
const io = local_modules.io;

const trackingIdKey = 'tracking_id';
const socketA = io(`/roomA`);

$("#back-button").on("click", () => {
  window.location = "/";
});

socketA.on("現在の部屋Aの入室情報",s => {
  $("#roomA-login-now").text(`${s}/3`);
})

$("#roomA-login-button").on("click",() => {
  socketA.emit("Aに入室希望",{});
});

socketA.on("入室OK", () => {
  $.post("/roby/login", "username=roomA&password=A");
})