'use strict';
import $ from "jquery";
const global = Function('return this;')();
global.jQuery = $;
import bootstrap from 'bootstrap';
import io from 'socket.io-client';
import { isConditional } from "babel-types";
const Config = require('../config');

const userId = $('#databaseData').data('userid');
let user_socketId = "";


//ニコニコ風コメント機能//
// namespace -> "/index"

//接続開始
const socket = io(`/index`);
//クライアントのコネクションがあったときにアニメclass追加と削除
socket.on('start data', (startObj) => {
  $('.item-Connection-Count').addClass('animated jello faster');
  setTimeout(RemoveClass, 1000);
  function RemoveClass() {
    $('.item-Connection-Count').removeClass('animated jello faster');
  }
});

//受信：count: indexとroom-Aの接続人数
socket.on('connection_count', (count) => {
  $('#connectionCount').text(`${count.count}`);
  $('.login_now').text(`${count.roomAcount}/7`);
})

//受信：count:コネクションが切れた後の人数
socket.on('disconnection_count', (count) => {
  $('#connectionCount').text(`${count.discount}`);
})


//ニコニココメントボタンによる送信
$("#Button_send-coment").click(() => {
  if ($("#input-coment").val().length === 0) { return; };
  socket.emit("nico", $("#input-coment").val());
  $("#input-coment").val("");
})
//ニコニココメントをエンターキーでも送れる機能
$("#input-coment").keypress((e) => {
  if (e.which === 13) {
    if ($("#input-coment").val().length === 0) { return; };
    socket.emit("nico", $("#input-coment").val());
    $("#input-coment").val("");
  }
})

//受信：ニココメント
socket.on("sending nicoComent", (msg) => {
  const HexNum = require('crypto').randomBytes(8).toString('hex');
  const marginTop_Array = ["10", "50", "90", "130", "170", "210", "250", "290", "330"];
  const marginTop_random = Math.floor(Math.random() * marginTop_Array.length);
  const marginTop = marginTop_Array[marginTop_random];
  $('.nico-comentArea').append(`<div class="move-text" id="C-${HexNum}" style="top:${marginTop}px;">${msg}</div>`);
  $(`#C-${HexNum}`).on('animationend', function () {
    $(`#C-${HexNum}`).remove();
  });
});

//ヘッダーアイコンクリックの挙動//
$('.item-Icon-Setting').click(() => {
  let CSS_status = $(".item-name-input-area").css("display");
  if (CSS_status === "none") {
    $(".item-name-input-area").css("display", "block");
  } else {
    $(".item-name-input-area").css("display", "none");
  }
});



//  画像ファイル名を入れた配列の作成  //
//　Characterimage_Array = [s-f001.png,s-f002.png,...s-f370.png]　//
function initChar() {
  let fileLength = 370;
  let chaFile = [];
  for (let i = 1; i <= fileLength; i++) {
    let fileNum = `00${i}`;
    chaFile.push(`s-f${fileNum.slice(-3)}.png`);
  }
  return chaFile;
}
const Characterimage_Array = initChar();


//☓ボタンを押したときにクローズ
$('.close_heder_toast').click(() => {
  $(".item-name-input-area").css("display", "none");
})

//名前変更ボタンクリック時の挙動//
$('#Button_change_userName').click(() => {
  //ボタンの属性データからクッキーの値を取得
  const char_Filename = Math.floor(Math.random() * Characterimage_Array.length);

  $('#error-div').text("");
  //クッキーの値が取れなかった時
  if (!userId) {
    $('#error-div').text("※ページをリロードしてください。");
    return;
  }

  //インプットエリアの値の取得
  const input_Value = $('#input-name').val();

  //もし文字数が0以下だった場合
  if (input_Value.length <= 0) {
    return;
  } else if (input_Value.length > 10) {　//文字数が11以上
    $('#error-div').text("※ニックネームは１０文字までです。")
    return;
  }

  //送信：キャラクター変更データ
  socket.emit("playerData_update", {
    userId,
    input_Value,
    picURL: `${Characterimage_Array[char_Filename]}`
  });

  socket.on('playerData_update_data', (data) => {
    $('#cha').attr('src', `./images/cha/${data.picURL}`);
    $('.userName').text(`${data.username}`);
    $('.nameDisplay').text(`${data.username}`);
  });
})

$('#check_in').click(() => {
  if (($("#check_in").text()) === "満席") {
    return;
  };
  if (($("#check_in").text()) === "プレイ中") {
    return;
  };
  socket.emit("PlayArea-login", {
    userId
  });
});

socket.on('Check-Room-member', (data) => {
  $("#check_in").text(`${data.status}`);
});
socket.on("SOCKET-ID", (data) => {
  user_socketId = data.ID;
})

//キャンセルボタン・リロードでルーム切断
$('.cancel-button').click(() => {
  window.location.reload();
});
socket.on('window-close', () => {
  $(".PlayArea").fadeOut();
})

socket.on('reset', () => {
  $('.reset').css("display", "flex");
  setTimeout(() => {
    window.location.reload();
  }, 1000);
})

socket.on('chaCard', (data) => {
  $(".PlayArea").fadeIn("fast");
  $('#play').empty();//初期化
  let Ready_count = 0;
  data.userArray.forEach((key) => {
    if (key[1].Ready === true) {
      Ready_count = Ready_count + 1;
      if (Ready_count === data.userArray.length && 2 < data.userArray.length) {
        socket.emit('Game-start', {});
        $(".Robby").fadeOut();
        $(".Game_Play").fadeIn();
        data.userArray.forEach((key) => {
          $("#Player-Game-1-Area").append(`
          <div class="item-Player-char">
          <img src="./images/cha/${key[1].userPicUrl}" class="char-size">
          <span class="Player-Name">${key[1].userName}</span>
          </div>
          `)
        });
        Game1_info();
        setTimeout(() => {
          socket.emit('lottery-Role', {});
        }, 5000);
      };
      $('#play').append(`
    <div class="item-CharacterCard card justify-content-around">
    <div class="Fukidashi">Ready!</div>
    <img src="./images/cha/${key[1].userPicUrl}" class="card-img-top" class="card-body" class="card-title">
    <p>　${key[1].userName}　</p>
    </div>
    `)
    } else {
      $('#play').append(`
      <div class="item-CharacterCard card justify-content-around">
      <img src="./images/cha/${key[1].userPicUrl}" class="card-img-top" class="card-body" class="card-title">
      <p>　${key[1].userName}　</p>
      </div>
      `)
    };
  });
})

function Game1_info() {
  $(".Game-1").append(`
  <marquee behavior="slide" direction="up">これより、各プレイヤーにロールを振り分けます。<br>ワンナイトルールのロールは「村人」「占い師」「怪盗」「人狼」の４つです。<br><span class="marker-Y">ロールの振り分け</span><br>人狼ｘ２　占い師ｘ１　怪盗ｘ１　村人ｘ１人から４人(参加人数で変動)</marquee>
  `);
}


//roomへjoinした
socket.on("Count_room-A_login", (msg) => {
  $('.login_now').text(`${msg.roomAconnect_Now}/7`);
  if (msg.roomAconnect_Now > 2 && msg.roomAconnect_Now < 8) {
    $("#ok-button").css("visibility", "visible");
  } else {
    $("#ok-button").css("visibility", "hidden");
  }
});

//準備完了ボタン押された
$('#ok-button').click(() => {
  socket.emit('Ready', {});
});

//受信：Ready:trueになった連想配列
socket.on('Ready-ok', (data) => {
  $('#play').empty();//初期化
  USERMAP = data.userArray;
  USERMAP.forEach((data) => {
    if (data.Ready === true) {
      $('#play').append(`
    <div class="item-CharacterCard card justify-content-around">
    <div class="Fukidashi">Ready!</div>
    <img src="./images/cha/${data.userPicUrl}" class="card-img-top" class="card-body" class="card-title">
    <p>　${data.userName}　</p>
    </div>
    `)
    } else {
      $('#play').append(`
      <div class="item-CharacterCard card justify-content-around">
      <img src="./images/cha/${data.userPicUrl}" class="card-img-top" class="card-body" class="card-title">
      <p>　${data.userName}　</p>
      </div>
      `)
    };
  });
})

//受信:ロール付きのプレイヤーデータ
socket.on('send-Role_Array', (data) => {
  $(".Game_Play").fadeOut();
  $(".Game_Play_Role-description").fadeIn();

  data.ROGIN_member_Map_Array.forEach((e) => {
    if ((e[0]) === user_socketId) {
      $(".Game-2-Role_description_Area").append(`
      あなたのロールは<br>
      <span style="font-size:42px;">- ${e[1].Role} -</span><br>
      に決まりました。
      `);
    }
  })
  setTimeout(() => {
    //ロールの振り分け画面消去
    $(".Game_Play_Role-description").fadeOut();
    let div_count = 0;
    setTimeout(() => {
      socket.emit('uranaisi-timeout',{});
    },11000);
    setTimeout(() => {
      data.ROGIN_member_Map_Array.forEach((e) => {
        if (e[0] === user_socketId) {
          if (e[1].Role === "村人") {
          $('#wait-uranaishi').fadeIn();
            $(".Game-3-Role_description_time").append(`
          <span style="font-size:42px;color:rgba(207, 79, 79);">- ${e[1].Role} -</span><br>
          特殊な能力はありません。昼に人狼を見つければ勝利です。<br>
          プレイヤー達に質問しながら、話の矛盾を探し、<br>
          情報を整理し、人狼を見つけましょう。
          `);
          };
          if (e[1].Role === "人狼") {
            $('#wait-uranaishi').fadeIn();
            $(".Game-3-Role_description_time").append(`
          <span style="font-size:42px;color:rgba(207, 79, 79);">- ${e[1].Role} -</span><br>
          人間を襲う人狼です。人間達から正体を隠しましょう<br>
          人狼が二人いる場合は、お互い正体を知ることができます。<br>
          占い師や村人を名乗るなどして、推理の邪魔をしましょう。
          `);
          };
          if (e[1].Role === "占い師") {
            $(".Game-3-Role_description_time").append(`
          <span style="font-size:42px;color:rgba(207, 79, 79);">- ${e[1].Role} -</span><br>
          真実を占える占い師です。占いの力により、プレイヤー1人のロールを<br>
          のぞき見るか、この対局で使われなかったロールを見ることができます。<br>
          村人たちに、自分が占い師であることを信用させつつ、<br>
          事実を皆に伝えましょう。
          <br><br>占う人を選んでください。※１０秒以内に選んでください。<br><br>
          `);
            data.ROGIN_member_Map_Array.forEach((key) => {
            if(!(key[0] === user_socketId)){
              $("#uranai-list").append(`
              <div class="item-Player-char" id="uranai-${div_count}">
              <img src="./images/cha/${key[1].userPicUrl}" class="char-size">
              <span class="Player-Name">${key[1].userName}</span>
              </div>
              `)
              $(`#uranai-${div_count}`).click(() => {
                $(".Game-3-Role_description_time").append(`
                  <p>${key[1].userName}さんのロールは「<span style="color:rgba(207, 79, 79);">${key[1].Role}</span>」と出ました。
                `);
                $("#uranai-list").fadeOut();
              });
              div_count++;
            };
            });
          };
          if (e[1].Role === "怪盗") {
            $('#wait-uranaishi').fadeIn();
            $(".Game-3-Role_description_time").append(`
          <span style="font-size:42px;color:rgba(207, 79, 79);">- ${e[1].Role} -</span><br>
          村を騒がす怪盗です。<br>
          夜の時間に、プレイヤー１人のロールと自分のロールを<br>
          こっそり入れ替えることができます。入れ替えたロールが<br>
          人狼であった場合、あなたは人狼となります。入れ替えた事は<br>
          自分自身以外知ることはできません。
          `);
          };
        };
      })
      //各ロールの説明＆占い師の行動パターン
      $('.Game_play_Uranaishi').fadeIn();

    }, 1000);
  }, 4000);
});

socket.on('kaitou-start', (e) =>{
  $('#wait-uranaishi').fadeOut();
  e.ROGIN_member_Map_Array.forEach((key) => {
    if(key[1].Role === "怪盗"){
      $(".Game-3-Role_description_time").append(`
      <span style="font-size:42px;color:rgba(207, 79, 79);">- ${key[1].Role} -</span><br>
      村を騒がす怪盗です。<br>
      夜の時間に、プレイヤー１人のロールと自分のロールを<br>
      こっそり入れ替えることができます。入れ替えたロールが<br>
      人狼であった場合、あなたは人狼となります。入れ替えた事は<br>
      自分自身以外知ることはできません。<br>
      入れ替える人を選んでください。(選ばないこともできます)
      `);
      e.ROGIN_member_Map_Array.forEach((key) => {
        if(!(key[0] === user_socketId)){
          $("#kaitou-list").append(`
          <div class="item-Player-char" id="uranai-${div_count}">
          <img src="./images/cha/${key[1].userPicUrl}" class="char-size">
          <span class="Player-Name">${key[1].userName}</span>
          </div>
          `)
          $(`#uranai-${div_count}`).click(() => {

            $("#kaitou-list").fadeOut();
          });
          div_count++;
        };
        });
    }else{
      $('#wait-kaitou').fadeIn();
    }
  });
});