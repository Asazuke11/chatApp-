## 人狼サポートツール「人狼くん。」　[![CircleCI](https://circleci.com/gh/Asazuke11/2019-20Winter/tree/cookie.svg?style=svg&circle-token=9c494b5264bc9a8de16293a2c371ef199bdf54d9)](https://circleci.com/gh/Asazuke11/2019-20Winter/tree/cookie)

### websocketを使って、人狼を「匿名」で遊ぶアプリです。  

このアプリは、N予備校のWebアプリ入門を学習しながら作った、  
人狼を遊ぶためのアプリです。  

人狼くん  
https://whispering-hollows-42826.herokuapp.com/index  

プレイ必要人数 : ３人から７人。  
議論時間 : １０分(短縮あり)  
ルール : ワンナイト人狼。  

投票は、票の多かった人物のみ表示。（票がバラけた場合は不成立)
最後に各自のロールが表示されますので、そこで勝敗を判断してください。orz


### 詳細

個人の設定したニックネームとキャラクターイメージはcookieと紐付けて、
データベースに保存させています。  

チャット＆プレイデータ履歴は、データベースに残さず、配列に入れるのみで  
揮発です。


勝敗の挙動部分は締め切り日に間に合わず未実装です orz