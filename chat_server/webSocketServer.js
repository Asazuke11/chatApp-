function createWebSocketServer(io, game) {

  const Io_Index = io.of('/');
  const Io_RoomA = io.of('/roomA');

  
  //接続者全員「　/　」部屋
  Io_Index.on('connection', (socket) => {

    //部屋コネクション情報送信
    Io_Index.emit('login_now', {
      size: Io_Index.sockets.size,
      roomA:game.USERS_DATA_MAP_A.size
    });

    //roomAへの接続
    socket.on("connect A", (userdata) => {
      game.MapA_Size_Check()
      .then( Mapsize => {
        if(Mapsize < 3){
          game.Login_AddMap(socket.id,userdata)
          .then( Asize => {
            Io_Index.emit('login_now', {
              size: Io_Index.sockets.size,
              roomA:Asize
            });
          })
        }else{
          Io_Index.emit('login_now', {
            size: Io_Index.sockets.size,
            roomA:game.USERS_DATA_MAP_A.size
          });
        }
      })
    })


    //受信：ニココメント
    socket.on('nico', (msg) => {
      //送信：全体へコメント送信
      Io_Index.volatile.emit('sending nicoComent', msg);
    });



    //クライアントがセッション切断
    socket.on('disconnect', () => {
      console.log("切断")
    })
  });


  /**
   * ROOM_A 関連
   */

  Io_RoomA.on('connection', (socket) => {
    Io_RoomA.emit("現在の部屋Aの入室情報", game.USERS_DATA_MAP_A.size)

    socket.on("Aに入室希望",() => {
      game.MapA_Size_Check()
      .then( s => {
        if(s < 3){
          Io_RoomA.to(socket.id).emit("入室OK",{});
        }
      })
    });



  });


};

module.exports = {
  createWebSocketServer
};