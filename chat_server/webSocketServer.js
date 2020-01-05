function createWebSocketServer(io, chat) {
                                
  const rootIo = io.of('/');
  rootIo.on('connection', (socket) => {

    //ユニーク-> socket
    //ブロードキャスト->rootIo
    rootIo.emit('start data', {
      coment:'WebSocket のコネクションがありました。'
    });

    socket.on('chat',(msg) => {
      rootIo.emit('chat',msg);
    })

    socket.on('disconnect', () => {});
  });
};

module.exports = {
  createWebSocketServer
};