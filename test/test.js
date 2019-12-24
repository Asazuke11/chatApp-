'use strict';
const request = require('supertest');
const assert = require('assert');
const app = require('../app');
var User = require('../models/user');
var pug = require('pug');

describe('/', () => {
  it('nicknameの値が無いとき「ななしの村人」の表示になる', (done) => {
    request(app)
      .get("/")
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(/ななしの村人/)
      .expect(200, done);
  });

  it('名前の変更が正常に行われる(更新', (done) => {
    request(app)
      .post("/nickname/1111")
      .send({ userId: 1111, inputValue: "aaaa" })
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.body.status, "OK");
        assert.equal(res.body.displayname, "aaaa");
        done();
      });
  });

  it('名前の変更が正常に行われる(読込', (done) => {
    User.upsert({ userId: 1111, username: 'testuser', displayname: "hoge" }).then(() => {
      request(app)
        .get("/")
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          User.findByPk(1111).then((s) => {
            assert.equal(s.userId, 1111);
            assert.equal(s.displayname, "hoge");
            const pugfile = pug.renderFile("./views/index.pug",{
              title: 'Are You a Werewolf?',
              user: s.userId,
              cookie_Id: s.userId,
              username:s
            });
            const regex_hoge = /hoge/;
            const regex_ID = /ID:1111/;
            const matchTest1 = regex_hoge.test(pugfile);
            const matchTest2 = regex_ID.test(pugfile);
            if(!matchTest1) throw new Error('データベース情報:displaynameが読み込まれていない');
            if(!matchTest2) throw new Error('データベース情報:userIdが読み込まれていない');
            done();
          });
        });
    });
  })
});
