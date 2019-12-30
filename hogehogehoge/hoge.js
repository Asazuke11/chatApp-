'use strict';

function OMIKUJI() {
  //ランダムな数値　0~99　を取得
  const random_Number = Math.floor(Math.random() * 99);

  //大吉確率5%の鬼みくじ
  if(random_Number < 5){ // 0-4　の時、大吉
    console.log('大吉');
  }else if(random_Number >= 5){ //4-99　の時、吉
    console.log('吉');
  };
};