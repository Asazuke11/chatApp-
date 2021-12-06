function createWebSocketServer(io, game) {

  const Io_Index = io.of('/');
  const Users = new Map();
  let Play_Now_count = 0;
  const voteMap = new Map();
  let vote_count = [];
  let timer = "";

  //接続者全員「　/　」部屋
  Io_Index.on('connection', (socket) => {
    socket.join("Everyone's room");

    game.Login_Size(Io_Index);
    game.RoomA_Size(Io_Index, Users.size);

    socket.on("Aへ入室希望", () => {
      if (Users.size < 7) {
        Io_Index.to(socket.id).emit("入室OK", {});
      }
    });

    socket.on("プレイヤー情報", (data) => {
      new Promise(resolve => {
        socket.join("A room");
        Users.set(socket.id, {
          userId: data.userId,
          userName:  data.userName,
          pic_Num: data.pic_Num,
          ready: false
        });
        resolve(Users);
      }).then(map => {
        const Asize = map.size;
        game.RoomA_Size(Io_Index, Asize);
        const userArray = Array.from(map);
        Io_Index.to("A room").emit("ルームAへ", userArray);
      })
    })

    socket.on("Ready", (data) => {
      Play_Now_count = 0
      new Promise(resolve => {
        Users.set(socket.id, {
          userId: data.userId,
          userName: data.userName,
          pic_Num: data.pic_Num,
          ready: true
        });
        resolve(Users);
      }).then((d) => {
        const userArray = Array.from(Users);
        Io_Index.to("A room").emit("準備OK", userArray);
      })
    })
    socket.on("not-Ready", (data) => {
      new Promise(resolve => {
        Users.set(socket.id, {
          userId: data.userId,
          userName: data.userName,
          pic_Num: data.pic_Num,
          ready: false
        });
        resolve(Users);
      }).then((d) => {
        const userArray = Array.from(Users);
        Io_Index.to("A room").emit("準備OK", userArray);
      })
    })

    socket.on("Game Start", () => {
      Play_Now_count++;
      if (Play_Now_count <= 1) {
        new Promise(resolve => {
          const userArray = Array.from(Users);
          Io_Index.to("A room").emit("ロール決定画面へ", {});
          game.lott_Role(userArray);
          game.upDate_Role_map(userArray, Users);
          resolve(userArray);
        }).then((d) => {
          new Promise(resolve => {
            setTimeout(() => {
              d.forEach((e) => {
                if ((e[0]) === socket.id) {
                  const role = e[1].Role;
                  Io_Index.to(socket.id).emit("ロール通知", role)
                }
              })
              resolve();
            }, 5000)
          }).then(() => {
            new Promise(resolve => {
              const d = Array.from(Users);
              setTimeout(() => {
                d.forEach((e) => {
                  if ((e[1].Role) === "村人") {
                    const id = e[0];
                    Io_Index.to(id).emit("村人", {})
                  }
                  if ((e[1].Role) === "人狼") {
                    const id = e[0];
                    Io_Index.to(id).emit("人狼", {})
                  }
                  if ((e[1].Role) === "占師") {
                    const id = e[0];
                    Io_Index.to(id).emit("占師", {})
                  }
                  if ((e[1].Role) === "怪盗") {
                    const id = e[0];
                    Io_Index.to(id).emit("怪盗", {})
                  }
                })
                resolve();
              }, 5000)
            });
          }).then(() => {
            new Promise(resolve => {
              let uranaishi = "";
              const uranaidata = [];
              Users.forEach((value, key) => {
                if(value.Role === "占師"){
                  uranaishi = key;
                }else{
                  uranaidata.push({id:key,name:value.userName,pic:value.pic_Num,job:value.Role});
                }
              });
              setTimeout(() => {
                if(uranaishi){
                  Io_Index.to(uranaishi).emit("占師の時間", uranaidata);
                }
                for(const value of uranaidata){
                  Io_Index.to(value.id).emit("占師以外の時間", {});
                }
                resolve();
              }, 12000);
            }).then(() => {
              const jinrou = [];
              const other = [];
              Users.forEach((value, key) => {
                if(value.Role === "人狼"){
                  jinrou.push({id:key,name:value.userName,pic:value.pic_Num});
                }else{
                  other.push({id:key,name:value.userName,pic:value.pic_Num,job:value.Role});
                }
              });
              new Promise(resolve => {
                setTimeout(() => {
                  for(const value of jinrou){
                    Io_Index.to(value.id).emit("人狼の時間", jinrou);
                  }
                  for(const value of other){
                    Io_Index.to(value.id).emit("人狼以外の時間", {});
                  }
                  resolve();
                }, 12000);
              }).then(() => {
                let kaitou = "";
                const other = [];
                Users.forEach((value, key) => {
                  if(value.Role === "怪盗"){
                    kaitou = key;
                  }else{
                    other.push({id:key,name:value.userName,pic:value.pic_Num,job:value.Role});
                  }
                });
                new Promise(resolve => {
                  setTimeout(() => {
                    if(kaitou){
                      Io_Index.to(kaitou).emit("怪盗の時間", other);
                    }
                    for(const value of other){
                      Io_Index.to(value.id).emit("怪盗以外の時間", {});
                    }
                    resolve();
                  }, 12000);
                }).then( () => {
                  new Promise( resolve => {
                    const userArray = Array.from(Users);
                    setTimeout(() => {
                      Io_Index.to("A room").emit("ゲームスタート", userArray);
                      resolve();
                    }, 12000);
                  }).then(()=>{
                      let c = 500;
                      timer = setInterval(()=> {
                        c--;
                        Io_Index.to("A room").emit("カウントダウン",c);
                        if(c <= 0) {
                          clearInterval(timer);
                          const userArray = Array.from(Users);
                          Io_Index.to('A room').emit('投票へ', userArray);
                        }
                      },1000)
                  })
                })
              })
            })
          })
        })
      }
    })

    socket.on("ジョブすり替えデータ", (d) => {
      const Kaitou = Users.get(socket.id);
      const murabito = Users.get(d.id);
      const log = "怪盗から " + d.change + "　にすり替わりました。";
      Users.set(socket.id,{
        userId: Kaitou.userId,
        userName: Kaitou.userName,
        pic_Num: Kaitou.pic_Num,
        ready: true,
        Role: log
      });
      Users.set(d.id,{
        userId: murabito.userId,
        userName: murabito.userName,
        pic_Num: murabito.pic_Num,
        ready: true,
        Role: "怪盗"
      })
    })

    socket.on('セリフ', (serifu) => {
      const player_data = Users.get(socket.id);
      let add_br_coment = serifu.replace(/\n/g, "<br>");
      Io_Index.to('A room').emit('セリフブロードキャスト', {
        player: player_data,
        coment: add_br_coment
      });
    });

    
    socket.on('go-vote', () => {
      voteMap.set(socket.id,{vote:true});
      const mapsize = voteMap.size;
      const userssize = Users.size;
      if(mapsize < userssize){
        Io_Index.to('A room').emit('前倒しの提案', mapsize);
      }
      if(mapsize === userssize){
        clearInterval(timer);
        const userArray = Array.from(Users);
        Io_Index.to('A room').emit('投票へ', userArray);
      }
    })

    socket.on("投票データ", d => {
      new Promise(resolve => {
        vote_count.push(d);
        resolve(vote_count);
      }).then((m) =>{
        new Promise(resolve => {
          const mapsize = m.length;
          const userssize = Users.size;
          if(mapsize === userssize){
            let count = {};
            m.forEach(function(i) {
              count[i] = (count[i] || 0) + 1;
            });
            for(const p in count){
              if(Users.has(p)){
                const d = Users.get(p);
                Users.set(p,{
                  userId: d.userId,
                  userName: d.userName,
                  pic_Num: d.pic_Num,
                  ready: true,
                  Role: d.Role,
                  vote: count[p]
                })
              }
            }
            resolve();
          }
        }).then(()=> {
          const userArray = Array.from(Users);
          Io_Index.to('A room').emit('結果発表', userArray);
        })

      })

    })

    //受信：ニココメント
    socket.on('nico', (msg) => {
      //送信：全体へコメント送信
      Io_Index.volatile.emit('sending nicoComent', msg);
    });

    //クライアントがセッション切断
    socket.on('disconnect', () => {
      game.deleteMap_Member(socket.id, Users)
        .then(() => {
          game.Login_Size(Io_Index);
          game.RoomA_Size(Io_Index, Users.size);
          const userArray = Array.from(Users);
          Io_Index.to("A room").emit("切断情報", userArray)
        })
    })
  });


};

module.exports = {
  createWebSocketServer
};