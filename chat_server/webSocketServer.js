function createWebSocketServer(io, chat) {

  const Io_Index = io.of('/index');

  const ROGIN_member_Map = new Map();

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
    });

    //受信：準備完了
    socket.on('Ready',() => {
      const player_parameter = ROGIN_member_Map.get(socket.id);

      ROGIN_member_Map.set(socket.id,{
        userCookie: player_parameter.userCookie,
        userPicUrl: player_parameter.userPicUrl,
        userName: player_parameter.userName,
        Ready:true
      })

      const ROGIN_member_Map_Array = Array.from(ROGIN_member_Map);
      Io_Index.to('room-A').emit('chaCard', {
        userArray: ROGIN_member_Map_Array
      });
      
    });

    //受信：クライアントがプレイエリアに入室
    socket.on('PlayArea-login', (playerData) => {
      //部屋に７人以上が入ってしまった時のガード句
      if(ROGIN_member_Map.size > 7){
        return;
      };

      //データベースからデータ抽出
      chat.User.findOne({
        where: {
          userId: playerData.userId
        }
      }).then((playerData) => {
        socket.join('room-A');
        
        //socketのidをkey値に
        ROGIN_member_Map.set(socket.id,{
          userCookie: playerData.userId,
          userPicUrl: playerData.picURL,
          userName: playerData.username,
          Ready:false
        });

        //入室人数が７人に達した時に満室の表示とリンクの切断
        if(ROGIN_member_Map.size > 6){
          Io_Index.emit("Check-Room-member",{
            status:"満席"
          })
        };

        console.log(ROGIN_member_Map);
        const ROGIN_member_Map_Array = Array.from(ROGIN_member_Map);

        //ROOM-Aへ送信：入室した全員のmapデータ
        Io_Index.to('room-A').emit('chaCard', {
          userArray: ROGIN_member_Map_Array
        });

        //全体へ送信:入室した人数
        Io_Index.emit("Count_room-A_login", {
          roomAconnect_Now: ROGIN_member_Map.size
        });

        socket.on('Game-start',() => {
          Io_Index.emit("Check-Room-member",{
            status:"プレイ中"
          });
        });

        //キャンセル時
        socket.on("disconnect", () => {
          //接続ユーザのクッキーをsplitで抽出
          //退出したユーザを配列から削除
          ROGIN_member_Map.delete(socket.id);
          let ROGIN_member_Map_Array = Array.from(ROGIN_member_Map);
          //Room-Aへ送信：現在の入室全員の入った配列データ
          Io_Index.to('room-A').emit('chaCard', {
            userArray: ROGIN_member_Map_Array
          });
          if(ROGIN_member_Map.size < 7){
            Io_Index.emit("Check-Room-member",{
              status:"予約する"
            })
          };
          Io_Index.emit("Count_room-A_login", {
            roomAconnect_Now: ROGIN_member_Map.size
          });

        });

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