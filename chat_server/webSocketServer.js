function createWebSocketServer(io, chat) {
  //トップページ
  const rootIo = io.of('/top');
  var connection_count = 0;

  rootIo.on('connection', (socket) => {
    connection_count++;
    rootIo.emit('connection_count', {
      count: connection_count
    });
    //ユニーク-> socket
    //ブロードキャスト->rootIo
    rootIo.emit('start data', {
      coment: 'WebSocket のコネクションがありました。'
    });

    socket.on('chat', (msg) => {
      rootIo.emit('chat', msg);
    })

    socket.on("add table",(data) => {
      rootIo.emet("roomTableData",data);
    })

    socket.on('disconnect', () => {
      connection_count--;
      rootIo.emit('disconnection_count',{
        discount: connection_count
      });
    });

  });

   //プレイルーム
  const rootioOfroom = io.of('/room');
  rootioOfroom.on('connection', (socket) => {

    const RoomID = socket.handshake.headers.referer.split('/room/')[1];
    //rootioOfroom.to(RoomID).emit ->同じページ全員へ送信
    //socket.emit -> 個人
    socket.join(RoomID);
    rootioOfroom.to(RoomID).emit('login', {
      coment: `WebSocket${RoomID} のコネクションがありました。`
    });

    rootioOfroom.on('req', (msg) => {
      rootioOfroom.to(RoomID).emit('res', msg.URL);
    });
  });
};


module.exports = {
  createWebSocketServer
};