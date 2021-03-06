function createWebSocketServer(io, chat) {

  const Io_Index = io.of('/index');
  var Array_count = require('count-array-values')//配列要素を数えるライブラリ
  let ROGIN_member_Map = new Map();
  let play_Now = false;

  Io_Index.on('connection', (socket) => {
    //入室０の時マップデリート
    if (!(Io_Index.adapter.nsp.adapter.rooms["room-A"])) {
      ROGIN_member_Map.clear();
    };

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
    socket.on('Ready', () => {
      const player_parameter = ROGIN_member_Map.get(socket.id);

      ROGIN_member_Map.set(socket.id, {
        userCookie: player_parameter.userCookie,
        userPicUrl: player_parameter.userPicUrl,
        userName: player_parameter.userName,
        Ready: true
      })

      const ROGIN_member_Map_Array = Array.from(ROGIN_member_Map);
      Io_Index.to('room-A').emit('chaCard', {
        userArray: ROGIN_member_Map_Array
      });

    });

    //受信：クライアントがプレイエリアに入室
    socket.on('PlayArea-login', (playerData) => {
      //部屋に７人以上が入ってしまった時のガード句
      if (ROGIN_member_Map.size > 7) {
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
        ROGIN_member_Map.set(socket.id, {
          userCookie: playerData.userId,
          userPicUrl: playerData.picURL,
          userName: playerData.username,
          Ready: false
        });

        //入室人数が７人に達した時に満室の表示とリンクの切断
        if (ROGIN_member_Map.size > 6) {
          Io_Index.emit("Check-Room-member", {
            status: "満席"
          });
        };
      

        //待受中の状態
        play_Now = false;

        Io_Index.to(socket.id).emit('SOCKET-ID', {
          ID: socket.id
        })

        let ROGIN_member_Map_Array = Array.from(ROGIN_member_Map);
        //ROOM-Aへ送信：入室した全員のmapデータ
        Io_Index.to('room-A').emit('chaCard', {
          userArray: ROGIN_member_Map_Array
        });

        //全体へ送信:入室した人数
        Io_Index.emit("Count_room-A_login", {
          roomAconnect_Now: ROGIN_member_Map.size
        });

        socket.on('Game-start', () => {
          play_Now = true;
          Io_Index.emit("Check-Room-member", {
            status: "プレイ中"
          });
        });

        socket.on('lottery-Role', () => {
          const ROGIN_member_Map_Array = Array.from(ROGIN_member_Map);
          if ((ROGIN_member_Map_Array[0][0]) === (socket.id)) {
            //ロールを付与
            chat.lott_Role(ROGIN_member_Map_Array);

            //Mapデータに変換しデータを更新
            upDate_Role_map(ROGIN_member_Map_Array);
            function upDate_Role_map(ROGIN_member_Map_Array) {
              for (let i = 0; i < ROGIN_member_Map_Array.length; i++) {
                ROGIN_member_Map.set(ROGIN_member_Map_Array[i][0], {
                  userCookie: ROGIN_member_Map_Array[i][1].userCookie,
                  userPicUrl: ROGIN_member_Map_Array[i][1].userPicUrl,
                  userName: ROGIN_member_Map_Array[i][1].userName,
                  Ready: ROGIN_member_Map_Array[i][1].Ready,
                  Role: ROGIN_member_Map_Array[i][1].Role
                })
              }
            }
            Io_Index.to('room-A').emit('send-Role_Array', {
              ROGIN_member_Map_Array
            });
          }
        });


        //人狼の行動ターン
        socket.on('uranaisi-timeout', () => {
          let ROGIN_member_Map_Array = Array.from(ROGIN_member_Map);
          if (ROGIN_member_Map_Array[0][0] === socket.id) {
            Io_Index.to('room-A').emit('jinrou-start', {
              ROGIN_member_Map_Array
            });
            ROGIN_member_Map_Array.forEach((key) => {
              if (key[1].Role === "人狼") {
                Io_Index.to(`${key[0]}`).emit('jinrou-turn', {
                  ROGIN_member_Map_Array
                });
              }
            });
          }
        });

        //怪盗の行動ターン
        socket.on('jinrou-timeout', () => {
          let ROGIN_member_Map_Array = Array.from(ROGIN_member_Map);
          if (ROGIN_member_Map_Array[0][0] === socket.id) {
            Io_Index.to('room-A').emit('kaitou-start', {
              ROGIN_member_Map_Array
            });
            ROGIN_member_Map_Array.forEach((key) => {
              if (key[1].Role === "怪盗") {
                Io_Index.to(`${key[0]}`).emit('kaitou-turn', {
                  ROGIN_member_Map_Array
                });
              }
            });
          };
        });
        socket.on('kaitou-work', (data) => {
          const change_Kaitou_data = ROGIN_member_Map.get(data.kaitou);
          const change_taisyou_data = ROGIN_member_Map.get(data.change_aite);
          const rirekituki = "元怪盗から " + data.henkou_Role + "　とすり替わりました。";
          ROGIN_member_Map.set(data.kaitou, {
            userCookie: change_Kaitou_data.userCookie,
            userPicUrl: change_Kaitou_data.userPicUrl,
            userName: change_Kaitou_data.userName,
            Ready: change_Kaitou_data.Ready,
            Role: rirekituki
          });
          ROGIN_member_Map.set(data.change_aite, {
            userCookie: change_taisyou_data.userCookie,
            userPicUrl: change_taisyou_data.userPicUrl,
            userName: change_taisyou_data.userName,
            Ready: change_taisyou_data.Ready,
            Role: "怪盗"
          });
        });

        //夜の時間終了
        socket.on('kaitou-timeout', () => {
          let ROGIN_member_Map_Array = Array.from(ROGIN_member_Map);
          if (ROGIN_member_Map_Array[0][0] === socket.id) {
            Io_Index.to('room-A').emit('Hiru-start', {});
          };
        });

        //カウントダウン開始
        let setTimer;
        socket.on('countDOWN', () => {
          let ROGIN_member_Map_Array = Array.from(ROGIN_member_Map);
          if (ROGIN_member_Map_Array[0][0] === socket.id) {
            const Time_Max = 60 * 10;//１０分
            COUNT_DOWN(Time_Max);
            function COUNT_DOWN(cnt) {
              setTimer = setInterval(() => {
                if (cnt < 0) {
                  Io_Index.to('room-A').emit('countDOWN-end', {});
                  Io_Index.to('room-A').emit('VOTE-VOTE', {
                    ROGIN_member_Map_Array
                  });
                  clearInterval(setTimer);
                  return;
                };
                if (cnt < 10) {
                  Io_Index.to('room-A').emit('countDOWN-10', {});
                }
                Io_Index.to('room-A').emit('countDOWN-now', {
                  cnt
                });
                cnt--
              }, 1000);
            }
          };
        })

        //制限時間前の投票希望
        socket.on('go-vote', () => {
          let go_vote_count = 0;
          cunt_go_vote(emit_go_vote);

          function cunt_go_vote(emit_go_vote) {
            const change_vote_data = ROGIN_member_Map.get(socket.id);
            ROGIN_member_Map.set(socket.id, {
              userCookie: change_vote_data.userCookie,
              userPicUrl: change_vote_data.userPicUrl,
              userName: change_vote_data.userName,
              Ready: change_vote_data.Ready,
              Role: change_vote_data.Role,
              go_vote: true
            });
            const ROGIN_member_Map_Array = Array.from(ROGIN_member_Map);
            ROGIN_member_Map_Array.forEach((e) => {
              if (e[1].go_vote) {
                go_vote_count++
              }
            });
            emit_go_vote()
          };

          function emit_go_vote() {
            if (go_vote_count === ROGIN_member_Map.size) {
              clearInterval(setTimer);
              const ROGIN_member_Map_Array = Array.from(ROGIN_member_Map);
              Io_Index.to('room-A').emit('countDOWN-end', {});
              Io_Index.to('room-A').emit('VOTE-VOTE', {
                ROGIN_member_Map_Array
              });
              return;
            }
            Io_Index.to('room-A').emit('emit_go_vote', { go_vote_count });
          }

        });


        socket.on('stopCount', () => {
          Io_Index.to('room-A').emit('countDOWN-end', {});
          clearInterval(setTimer);
        });

        //お昼部分
        socket.on('Serifu', (serifu) => {
          const player_data = ROGIN_member_Map.get(socket.id);
          let add_br_coment = serifu.replace(/\n/g, "<br>");
          Io_Index.to('room-A').emit('add-coment-hiru', {
            player: player_data,
            coment: add_br_coment
          });
        });

        socket.on('go-vote-cancel', () => {
          let go_vote_count = 0;
          cunt_go_vote(emit_go_vote_cancel);

          function cunt_go_vote(emit_go_vote) {
            const change_vote_data = ROGIN_member_Map.get(socket.id);
            ROGIN_member_Map.set(socket.id, {
              userCookie: change_vote_data.userCookie,
              userPicUrl: change_vote_data.userPicUrl,
              userName: change_vote_data.userName,
              Ready: change_vote_data.Ready,
              Role: change_vote_data.Role,
              go_vote: false
            });
            const ROGIN_member_Map_Array = Array.from(ROGIN_member_Map);
            ROGIN_member_Map_Array.forEach((e) => {
              if (e[1].go_vote) {
                go_vote_count++
              }
            });
            emit_go_vote_cancel()
          };

          function emit_go_vote_cancel() {
            Io_Index.to('room-A').emit('emit_go_vote', { go_vote_count });
          }

        });//

        //受信：投票データ
        socket.on('vote-send-server', (e) => {
          let vote_count = 0;

          //投票データをMAPに保存
          count_vote(e);
          function count_vote(e) {
            const vote = e.player;
            const change_vote_data = ROGIN_member_Map.get(socket.id);
            ROGIN_member_Map.set(socket.id, {
              userCookie: change_vote_data.userCookie,
              userPicUrl: change_vote_data.userPicUrl,
              userName: change_vote_data.userName,
              Ready: change_vote_data.Ready,
              Role: change_vote_data.Role,
              go_vote: change_vote_data.go_vote,
              vote: vote
            });
            const ROGIN_member_Map_Array = Array.from(ROGIN_member_Map);
            ROGIN_member_Map_Array.forEach((e) => {
              if (e[1].vote) {
                vote_count++
              }
            });
            emit_vote()
          };

          function emit_vote() {
            let aggregate_result = [];

            //全員が投票した時
            if (vote_count === ROGIN_member_Map.size) {
              let aggregate = [];//投票対象者を入れる配列
              const ROGIN_member_Map_Array = Array.from(ROGIN_member_Map);

              for (let i = 0; i < ROGIN_member_Map_Array.length; i++) {
                aggregate.push(ROGIN_member_Map_Array[i][1].vote);
              }

              //配列の同値をカウントライブラリ使用(多いのが先頭になる)
              // { value: '/index#kEK30VrOufDKYu6GAAAJ', count: 1 }
              // { value: '/index#IJdqruMKSluI9fIGAAAG', count: 1 }
              // { value: '/index#HrBMSkgeEgktdfyBAAAE', count: 1 }
              aggregate_result = Array_count(aggregate);

              //送信:結果発表
              let target_mem_count = -1;
              //参加人数の半数以上が同数取った時はバラけと判断。
              let required_number = Math.ceil(aggregate_result.length / 2);
              for (let i = 0; i < aggregate_result.length; i++) {
                if (aggregate_result[0].count === aggregate_result[i].count) {
                  target_mem_count = target_mem_count + 1;
                }
              }

              if (target_mem_count >= required_number) {
                Io_Index.to('room-A').emit('VOTE-Result', {
                  data: ROGIN_member_Map_Array,
                  result_flag: 0,
                  result_array: aggregate_result
                });
              };
              if (target_mem_count < required_number) {
                Io_Index.to('room-A').emit('VOTE-Result', {
                  data: ROGIN_member_Map_Array,
                  result_flag: 1,
                  result_array: aggregate_result,
                  equal_num: target_mem_count
                });
              };
            };

            //送信：投票済み人数送信(全員ではない)
            Io_Index.to('room-A').emit('emit_vote', {
              length: ROGIN_member_Map.size,
              vote_count: vote_count
            });
          };
        });
          
          //キャンセル時
          socket.on("disconnect", () => {
            if (play_Now) {
              Io_Index.to('room-A').emit('reset', {});
            };
            //退出したユーザを配列から削除
            
            ROGIN_member_Map.delete(socket.id);
            let ROGIN_member_Map_Array = Array.from(ROGIN_member_Map);
            //ゲームが始まる前の切断時の挙動
            if (!play_Now) {
              //Room-Aへ送信：現在の入室全員の入った配列データ
              Io_Index.to('room-A').emit('chaCard', {
                userArray: ROGIN_member_Map_Array
              });
              if (ROGIN_member_Map.size < 7) {
                Io_Index.emit("Check-Room-member", {
                  status: "予約する"
                })
              };
            }

          Io_Index.emit("Count_room-A_login", {
            roomAconnect_Now: ROGIN_member_Map.size
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
});
}

module.exports = {
  createWebSocketServer
};