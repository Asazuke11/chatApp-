'use strict';
import $ from "jquery";
const global = Function('return this;')();
global.jQuery = $;
import bootstrap from 'bootstrap';

const nickname_change_button = $('#userNameButton');
const userName_area = $('.userName');
const error_area = $('#error-div');
nickname_change_button.click(() => {
  const cookieID = nickname_change_button.data('user-id');
  if(!cookieID){
    error_area.text("※ページをリロードしてください。");
    return;
  }
  error_area.text("");
  const inputValue = $('#input-name').val();
  if(inputValue.length === 0){
    return;
  }else if(inputValue.length > 10){
    error_area.text("※ニックネームは１０文字までです。")
    return;
  }
  
  $.post(`/nickname/${cookieID}`,{
    inputValue:inputValue
  },
  (data) => {
    userName_area.text(`${data.displayname}`)
  })
})