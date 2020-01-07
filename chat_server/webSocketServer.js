function createWebSocketServer(io, chat) {

  const rootIo = io.of('/');
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

    socket.on('disconnect', () => {
      connection_count--;
      rootIo.emit('disconnection_count',{
        discount: connection_count
      });
    });
  });
};

module.exports = {
  createWebSocketServer
};