## 人狼サポートツール「人狼くん。」　[![CircleCI](https://circleci.com/gh/Asazuke11/2019-20Winter/tree/cookie.svg?style=svg&circle-token=9c494b5264bc9a8de16293a2c371ef199bdf54d9)](https://circleci.com/gh/Asazuke11/2019-20Winter/tree/cookie)

### websocketを使って、人狼を「匿名」で遊ぶアプリです。  
注）勝利者の判別機能などがなかったりの未完成品です。  
これは、N予備校のWebアプリ入門を学習しながら作った、  
人狼を遊ぶためのアプリです。  

人狼くん  
https://whispering-hollows-42826.herokuapp.com/index  

プレイ必要人数 : ３人から７人。  
議論時間 : １０分(短縮あり)  
ルール : ワンナイト人狼。  

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
※このアプリは挙動がおかしかったのを締め切り後に  
修正してるので、正確には違反してます。すみません。
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

### 詳細
残念ながら締切日までに完成が間に合わず、勝利の判定など、最後が簡素(雑)になっています。  

基本的にはWebsocketを中心にしたアプリケーションです。  
個人の設定したニックネームとキャラクターイメージはcookieと紐付けて、
データベースに保存させています。  

チャット＆プレイデータ履歴は、データベースに残さず、配列に入れるのみで  
揮発的にしてます。

プレイヤーが部屋に入室したところから、プレイヤーのデータを連想配列  
ROGIN_member_Map　に入れて、これを元に進めています。(key名はWebsocketが自動的に割り振るクッキーのsocketIdの値)  

投票の集計に関しては、人狼のルールで票がバラけた場合は、  
誰も選ばれないという仕組みらしいので、最も票を受けたプレイヤーと  
同じ票数のプレイヤーが参加人数の半分以上いた場合に不成立判定にしています。  

勝敗の挙動部分は締め切り日に間に合わず未実装です orz