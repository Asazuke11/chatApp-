function createWebSocketServer(io, game) {
  //トップページ
  const Io_Index = io.of('/index');
  let ROGIN_member = [];
  let userCookie_value;

  Io_Index.on('connection', (socket) => {
    //room-Aが存在していたらログイン数、存在しなければ０とする関数
    let connect_now_rooma = roomA_count();
    function roomA_count() {
      if (Io_Index.adapter.nsp.adapter.rooms["room-A"]) {
        return Io_Index.adapter.rooms["room-A"].length;
      } else {
        return 0;
      };
    }
    Io_Index.emit('connection_count', {
      //index空間の接続人数表示
      count: Io_Index.adapter.nsp.server.eio.clientsCount,
      roomAcount: connect_now_rooma
    });

    //部屋全体へコネクション情報送信
    Io_Index.emit('start data', {});

    //クライアントからチャットコメント受信
    socket.on('chat', (msg) => {

      //部屋全体へコメントデータ送信
      Io_Index.emit('chat', msg);
    })

    //クライアントからプレイエリアログイン情報
    socket.on('PlayArea-login', (data) => {
      socket.join('room-A');

      ROGIN_member.push({userCookie:data.userId,userPicUrl: data.picURL,userName: data.username});

      Io_Index.to('room-A').emit('chaCard', {
        userData: data,
        userArray:ROGIN_member
      });
      Io_Index.emit("Status-login", {
        roomAconnect_Now: Io_Index.adapter.rooms["room-A"].length
      })
      let RoomA_nowLogin_length = Io_Index.adapter.rooms["room-A"].length;

      socket.on("disconnect", () => {
        RoomA_nowLogin_length--
        const disconnect_user = socket.handshake.headers.cookie.split('tracking_id=')[1].split(';')[0];
        const disconnect_Array_index = ROGIN_member.findIndex(({userCookie}) => userCookie === disconnect_user);
        ROGIN_member.splice(disconnect_Array_index,1);
        Io_Index.to('room-A').emit('chaCard', {
          userArray:ROGIN_member
        });
        Io_Index.emit("Status-login", {
          roomAconnect_Now: RoomA_nowLogin_length
        })
      })
    });

    //クライアントがセッション切断
    socket.on('disconnect', () => {
      //部屋全体へ接続人数情報の更新
      Io_Index.emit('disconnection_count', {
        discount: Io_Index.adapter.nsp.server.eio.clientsCount
      });

    });

  });
};


module.exports = {
  createWebSocketServer
};