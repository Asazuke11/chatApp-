function createWebSocketServer(io, chat) {
                                
  const rootIo = io.of('/lobby');
  rootIo.on('connection', (socket) => {
    console.log('WebSocket のコネクションがありました。');

    socket.join('room');
    rootIo.to("room").emit("sendMessageToClient", {
      value: "1人入室しました。"
    });


    socket.on("chat message",(msg) => {
      rootIo.to("room").emit('some event',{
        chat: msg
      });
    });
  
    socket.on('disconnect', () => {
      rootIo.emit("user disconnected", {value:"1人退出しました。"});
    });
  });
}

module.exports = {
  createWebSocketServer
};