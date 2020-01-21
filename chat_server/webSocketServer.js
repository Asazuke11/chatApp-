function createWebSocketServer(io, chat) {

  const Io_Index = io.of('/index');
  const ROGIN_member = [];

  Io_Index.on('connection', (socket) => {


    //現在の入室プレイヤー人数を取得する関数
    Io_Index.emit('connection_count', {
      count: Io_Index.adapter.nsp.server.eio.clientsCount,
      roomAcount: chat.roomA_count(Io_Index)
    });

    //部屋全体へコネクション情報送信
    Io_Index.emit('start data', {});

    //受信：ニココメント
    socket.on('nico', (msg) => {
      //送信：全体へコメント送信
      Io_Index.volatile.emit('sending nicoComent', msg);
    });

    //受信：プレイヤーデータ更新
    socket.on("playerData_update", (data) => {
      chat.playerData_update(data);
      Io_Index.to(socket.id).emit('playerData_update_data', {
        username: data.input_Value,
        picURL: data.picURL
      });
    })

    //受信：クライアントがプレイエリアに入室
    socket.on('PlayArea-login', (playerData) => {

      //７人以上が入ってしまった時のガード
      if(ROGIN_member.length > 7){
        return;
      };
      chat.User.findOne({
        where: {
          userId: playerData.userId
        }
      }).then((playerData) => {
        socket.join('room-A');

        ROGIN_member.push({ userCookie: playerData.userId, userPicUrl: playerData.picURL, userName: playerData.username });
        if(ROGIN_member.length > 6){
          Io_Index.emit("Check-Room-member",{
            status:"満席"
          })
        };
        console.log(ROGIN_member);

        //ROOM-Aへ送信：入室した全員の配列データ
        Io_Index.to('room-A').emit('chaCard', {
          userData: playerData,
          userArray: ROGIN_member
        });

        //全体へ送信:入室した人数
        Io_Index.emit("Count_room-A_login", {
          roomAconnect_Now: ROGIN_member.length
        });

        socket.on("disconnect", () => {
          //接続ユーザのクッキーをsplitで抽出
          const disconnect_user = socket.handshake.headers.cookie.split('tracking_id=')[1].split(';')[0];
          //退出したユーザを配列から削除
          const disconnect_Array_index = ROGIN_member.findIndex(({ userCookie }) => userCookie === disconnect_user);
          ROGIN_member.splice(disconnect_Array_index, 1);

          //Room-Aへ送信：現在の入室全員の入った配列データ
          Io_Index.to('room-A').emit('chaCard', {
            userArray: ROGIN_member
          });
          if(ROGIN_member.length < 7){
            Io_Index.emit("Check-Room-member",{
              status:"予約する"
            })
          };
          Io_Index.emit("Count_room-A_login", {
            roomAconnect_Now: ROGIN_member.length
          });
        })
      });
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