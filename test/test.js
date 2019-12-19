'use strict';
const request = require('supertest');
const app = require('../app');
const passportStub = require('passport-stub');

//テスト・ログアウト中
describe('/', () => {

  //ログイン・ログアウトリンク確認
  it('GitHub認証ログインリンクが含まれる', (done) => {
    request(app)
      .get("/")
      .expect('Content-Type','text/html; charset=utf-8')
      .expect(/<a href="\/auth\/github">/)
      .expect(200, done)
  });
  it('Twitter認証ログインリンクが含まれる', (done) => {
    request(app)
      .get("/")
      .expect('Content-Type','text/html; charset=utf-8')
      .expect(/<a href="\/auth\/twitter">/)
      .expect(200, done)
  });
  it('ログアウトリンクが含まれる', (done) => {
    request(app)
      .get("/")
      .expect('Content-Type','text/html; charset=utf-8')
      .expect(/<a href="\/logout">/)
      .expect(200, done)
  });
  it('ログイン状況が表示されない', (done) => {
    request(app)
      .get("/")
      .expect(checkMoji)
      .expect(200, done);

      //文字の存在のチェック関数
      function checkMoji(res){
        const checkText = res.text.match(/ログイン中/m); 
        if(checkText) throw new Error('文字が存在している');
      }
  });
})

//テスト・ログイン中
describe('/', () => {

  before(() => {
    passportStub.install(app);
    passportStub.login({ username: 'tesuser'});
  });
  after(() => {
    passportStub.logout();
    passportStub.uninstall(app);
  });

  //ログイン・ログアウトリンク確認
  it('GitHub認証ログインリンクが含まれる(ログイン中)', (done) => {
    request(app)
      .get("/")
      .expect('Content-Type','text/html; charset=utf-8')
      .expect(/<a href="\/auth\/github">/)
      .expect(200, done)
  });
  it('Twitter認証ログインリンクが含まれる(ログイン中)', (done) => {
    request(app)
      .get("/")
      .expect('Content-Type','text/html; charset=utf-8')
      .expect(/<a href="\/auth\/twitter">/)
      .expect(200, done)
  });
  it('ログアウトリンクが含まれる(ログイン中)', (done) => {
    request(app)
      .get("/")
      .expect('Content-Type','text/html; charset=utf-8')
      .expect(/<a href="\/logout">/)
      .expect(200, done)
  });
  it('ログイン状況が表示される(ログイン中)', (done) => {
    request(app)
      .get("/")
      .expect(/ログイン中/)
      .expect(200, done)
  });
  it('Github認証後、/ へのリダイレクト', (done) => {
    request(app)
      .get("/auth/github/callback")
      .expect(302, done)
  });
  it('Github認証後、/ へのリダイレクト', (done) => {
    request(app)
      .get("/auth/twitter/callback")
      .expect(302, done)
  });
  it('ログアウト後、/ へのリダイレクト', (done) => {
    request(app)
      .get("/logout")
      .expect('Location','/')
      .expect(302, done)
  });
})