'use strict';
const request = require('supertest');
const assert = require('assert');
const app = require('../app');
var User = require('../models/user');
var pug = require('pug');

describe('/', () => {

  it('/ get時のステータスコード200の確認', (done) => {
    request(app)
      .get("/")
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200,done);
  });
  it('クッキーがない時、「ななしの村人」の表示になる', (done) => {
    request(app)
      .get("/")
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(/ななしの村人/)
      .expect(200, done);
  });
  
  it('名前の変更が正常に行われる(更新', (done) => {
    request(app)
      .post("/username/1111")
      .send({ userId: 1111, input_Value: "testuser" })
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.body.status, "OK");
        assert.equal(res.body.username, "testuser");
        done();
      });
  });

  it('名前の変更が正常に行われる(読込', (done) => {
    User.upsert({ userId: "1111", username: 'testuser', picURL: "pic.png" ,expires: "20201111" }).then(() => {
      request(app)
        .get("/")
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          User.findByPk("1111").then((database_data) => {
            const pugfile = pug.renderFile("./views/index.pug",{
              title: 'Are You a Werewolf?',
              database_data:database_data
            });
            const regex_username = /testuser/;
            const regex_picURL = /pic.png/;
            const matchTest1 = regex_username.test(pugfile);
            const matchTest2 = regex_picURL.test(pugfile);
            assert.ok(matchTest1 === true);
            assert.ok(matchTest2 === true);
            done();
          });
        });
    });
  })

});
