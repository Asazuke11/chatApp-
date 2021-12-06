"use strict";
const local_modules = require("./local-modules");
const $ = local_modules.$;
const socket = local_modules.socket;
let Ready_Button = -1;

//キャンセルボタン・リロードでルーム切断
$('.cancel-button').click(() => {
  $(".ROOM-A").hide();
  window.location.reload();
});

$('#ok-button').click(() => {
  Ready_Button *= -1;
  if(Ready_Button === 1){
    $('#ok-button').text("中断")
    const USER_DATA = local_modules.get_LocalStorageData();
    socket.emit('Ready', USER_DATA);
  }
  if(Ready_Button === -1){
    $('#ok-button').text("準備完了")
    const USER_DATA = local_modules.get_LocalStorageData();
    socket.emit('not-Ready', USER_DATA);
  }
});

socket.on("準備OK", Array => {
  new Promise(resolve => {
    let Ready_count = 0;
    $(".playerCardArea").empty();
    Array.forEach(key => {
      if(key[1].ready){
        Ready_count++;
        $(".playerCardArea").append(`
        <div class="card">
        <img src="../images/cha/${key[1].pic_Num}" class="char-size">
        <div class="Fukidashi">Ready!</div>
        <div class="Player-Name">${key[1].userName}</div>
        </div>`)
      }else{
        $(".playerCardArea").append(`
        <div class="card">
        <img src="../images/cha/${key[1].pic_Num}" class="char-size">
        <div class="Player-Name">${key[1].userName}</div>
        </div>`)
      }
    });
    resolve(Ready_count);
  }).then((c) => {
    if(c >= 7){
      socket.emit("Game Start",{});
    }
  })

})

socket.on("切断情報", map => {
  $(".playerCardArea").empty();
  map.forEach(key => {
    $(".playerCardArea").append(`
    <div class="card">
    <img src="./images/cha/${key[1].pic_Num}" class="char-size">
    <div class="Player-Name">${key[1].userName}</div>
    </div>`)
  })
})


socket.on("ロール決定画面へ",() => {
  $("#roomA-login-now").text(`プレイ中`);
  $(".ROOM-A").hide();
  $(".Game_Play").show();
  $(".Role_description_Area").append(`<marquee behavior="slide" direction="up">これより、各プレイヤーにロールを振り分けます。<br>ワンナイトルールのロールは「村人」「占師」「怪盗」「人狼」の４つです。<br><span class="marker-Y">ロールの振り分け</span><br>人狼ｘ２　占い師ｘ１　怪盗ｘ１　村人ｘ１～４人(参加人数で変動)</marquee>`);
})
socket.on("ロール通知",(m) => {
  $(".Role_description_Area").empty();
  $(".Role_description_Area").append(`あなたのロールは<br>
  <span style="font-size:38px;">- ${m} -</span><br>
  に決まりました。`);
})

socket.on("村人",() => {
  $(".Role_description_Area").empty();
  $(".Role_description_Area").append(`
  今回、あなたのロールは<br>
  <span style="font-size:38px;color:rgba(207, 79, 79);">「村人」</span><br>
  特殊な能力はありません。昼に人狼を見つければ勝利です。<br>
  プレイヤー達に質問しながら、話の矛盾を探し、<br>
  情報を整理し、人狼を見つけましょう。
  `)
})

socket.on("人狼",() => {
  $(".Role_description_Area").empty();
  $(".Role_description_Area").append(`
  今回、あなたのロールは<br>
  <span style="font-size:38px;color:rgba(207, 79, 79);">「人狼」</span><br>
  人間を襲う人狼です。人間達から正体を隠しましょう<br>
  人狼が二人いる場合は、お互い正体を知ることができます。<br>
  占い師や村人を名乗るなどして、推理の邪魔をしましょう。
  `);
})

socket.on("占師",() => {
  $(".Role_description_Area").empty();
  $(".Role_description_Area").append(`
  今回、あなたのロールは<br>
  <span style="font-size:38px;color:rgba(207, 79, 79);">「占師」</span><br>
  真実を占える占師です。占いの力により、プレイヤー1人のロールを<br>
  のぞき見るか、この対局で使われなかったロールを見ることができます。<br>
  村人たちに、自分が占師であることを信用させつつ、<br>
  事実を皆に伝えましょう。
  `);
})
socket.on("怪盗",() => {
  $(".Role_description_Area").empty();
  $(".Role_description_Area").append(`
  今回、あなたのロールは<br>
  <span style="font-size:42px;color:rgba(207, 79, 79);">「怪盗」</span><br>
  村を騒がす怪盗です。<br>
  夜の時間に、プレイヤー１人のロールと自分のロールを<br>
  こっそり入れ替えることができます。入れ替えたロールが<br>
  人狼であった場合、あなたは人狼となります。入れ替えた事は<br>
  あなた以外、知ることはできません。
  `);
})

socket.on("占師の時間",(d) => {
  $("#wait-uranaishi").empty()
  $("#wait-uranaishi").append(`
  <img src="../images/icon/ajax-loader.gif" class="float">
  <span>ロールを占いたいプレイヤーをクリックしてください。※１０秒以内</span>`)
  $("#wait-uranaishi").show();
  d.forEach((e) => {
    $(".uranai-list").append(`
    <div class="hover-div">
    <div class="item-Player-char" id="uranai-${e.id}">
    <img src="./images/cha/${e.pic}" class="char-size">
    <span class="Player-Name">${e.name}</span>
    </div></div>
    `)
    $(`#uranai-${e.id}`).on("click",() => {
      $("#wait-uranaishi").empty();
      $("#wait-uranaishi").append(`<span>${e.name}さんのロールは「${e.job}」と出ました。</span>`)
      $(".uranai-list").hide();
    })
  });
  
})
socket.on("占師以外の時間",() => {
  $("#wait-uranaishi").show();
})
socket.on("人狼の時間",(d) => {
  $("#wait-uranaishi").hide();
  $(".uranai-list").hide();
  $(".uranai-list").empty();
  d.forEach((e) => {
    $(".jinrou-list").append(`
    <div class="item-Player-char" id="uranai-${e.id}">
    <img src="./images/cha/${e.pic}" class="char-size">
    <span class="Player-Name">${e.name}</span>
    </div>
    `)
  });
  $(".jinrou-list").show();
  $("#wait-jinrou").empty();
  $("#wait-jinrou").append(`
  <img src="../images/icon/ajax-loader.gif" class="float">
  <span>このプレイヤーが人狼です。協力して村人を騙しましょう。<br>※他のプレイヤーには見えていません。</span>`)
  $("#wait-jinrou").show();
})
socket.on("人狼以外の時間",() => {
  $("#wait-uranaishi").hide();
  $(".uranai-list").hide();
  $("#wait-jinrou").show();
})

socket.on("怪盗の時間",(d) => {
  $(".jinrou-list").hide();
  $("#wait-jinrou").hide();
  $("#wait-kaitou").empty();
  $("#wait-kaitou").append(`
  <img src="../images/icon/ajax-loader.gif" class="float">
  <span>ロールを入れ替えます。入れ替えるプレイヤーを選んでください。※１０秒以内</span>`)
  $("#wait-kaitou").show();
  d.forEach((e) => {
    $(".kaitou-list").append(`
    <div class="hover-div">
    <div class="item-Player-char" id="kaitou-${e.id}">
    <img src="./images/cha/${e.pic}" class="char-size">
    <span class="Player-Name">${e.name}</span>
    </div></div>
    `)
    $(`#kaitou-${e.id}`).on("click",() => {
      const id = e.id;
      const role = e.job;
      $("#wait-kaitou").empty();
      $("#wait-kaitou").append(`<span>${e.name}さんのロール、「${e.job}」と入れ替えました。</span>`);
      socket.emit("ジョブすり替えデータ",{
        id : id,
        change: role
      })
      $(".kaitou-list").hide();
    })
  });
})

socket.on("怪盗以外の時間",() => {
  $(".jinrou-list").hide();
  $("#wait-jinrou").hide();
  $("#wait-kaitou").show();
})

socket.on("ゲームスタート",() => {
  $("#wait-kaitou").hide();
  $(".Game_Play").hide();
  $(".relative-area").show();
  $(".announce-area").fadeIn();
  setTimeout(() => {
    $(".announce-area").fadeOut();
  },1000)
})

$("#Button_send-Hirucoment").click(() => {
  if ($("#coment-Hiru").val().length === 0) { return; };
  socket.emit("セリフ", $("#coment-Hiru").val());
  $("#coment-Hiru").val("");
})
socket.on('セリフブロードキャスト', (e) => {
  $(".first-come").empty();
  $(".first-come").append(`
  <div class="wakuB">
  <img src="../images/cha/${e.player.pic_Num}" class="char-Catsize-B">
  <div class="name-plate-L">${e.player.userName}</div>
  <div class="fukidasi-Catsize-L">
    <span>${e.coment}</span>
  </div>
  </div>`)
  $(".log").prepend(`
  <div class="waku">
  <img src="../images/cha/${e.player.pic_Num}" class="char-Catsize-L">
  <div class="name-plate-L">${e.player.userName}</div>
  <div class="fukidasi-Catsize-L">
    <span>${e.coment}</span>
  </div>
  </div>
  `);
})

socket.on("カウントダウン", c => {
  $("#timer").text(`　${c}`);
})

$("#go-vote-button").on("click",() => {
  socket.emit('go-vote', {});
});
socket.on("前倒しの提案",(s) => {
  $("#teian-count").text(`${s}人から前倒し投票の提案がありました。`)
})
socket.on("投票へ",(d) => {
  $(".koma-area").hide();
  $("#Start-Talk").empty();
  $("#Start-Talk").text(`これより追放するプレイヤーを投票で決めます。`);
  $(".announce-area").fadeIn();
  setTimeout(() => {
    $(".announce-area").fadeOut();
    $(".console-area").hide();
    d.forEach((e) => {
      $(".vote-area").append(`
      <div class="hover-div-v">
      <div class="item-Player-char" id="vote-${e[0]}">
      <img src="./images/cha/${e[1].pic_Num}" class="char-size">
      <span class="Player-Name">${e[1].userName}</span>
      </div></div>
      `)
      $(`#vote-${e[0]}`).on("click",() => {
        $(".vote-area").hide();
        const id = e[0];
        socket.emit("投票データ", id)
      })
    });
  },3000);
})

socket.on("結果発表",(a)=> {
  $("#Start-Talk").empty();
  $("#Start-Talk").text(`結果発表`);
  $(".announce-area").fadeIn();
  $(".vote-area").empty();
  $(".vote-area").show();
  setTimeout(() => {
    $(".announce-area").fadeOut();
    a.forEach((e) => {
      $(".vote-area").append(`
      <div class="item-Player-char"">
      <img src="./images/cha/${e[1].pic_Num}" class="char-size">
      <span class="Player-Name">${e[1].userName}<br>投票数${e[1].vote || 0}</span>
      </div>
      `)
    });
  },3000);
  setTimeout(() => {
    $("#Start-Talk").empty();
    $("#Start-Talk").text(`各プレイヤーのロールの発表です`);
    $(".announce-area").fadeIn();
  },7000);
  setTimeout(() => {
    $(".announce-area").fadeOut();
    $(".vote-area").empty();
    a.forEach((e) => {
      $(".vote-area").append(`
      <div class="item-Player-char"">
      <img src="./images/cha/${e[1].pic_Num}" class="char-size">
      <span class="Player-Name">${e[1].userName}<br>投票数${e[1].vote || 0}<br>${e[1].Role}</span>
      </div>
      `)
    });
  },10000);
})
