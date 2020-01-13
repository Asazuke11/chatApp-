'use strict';
import $ from "jquery";
const global = Function('return this;')();
global.jQuery = $;
import bootstrap from 'bootstrap';
import io from 'socket.io-client';
import { isConditional } from "babel-types";
const Config = require('../config');

const Room_URL = $("#room-data").attr('data-roomurl')
const socket = io(`/room`);

socket.on('login', (data) => {
  
});