var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');

var Config = require('./config');

var session = require('express-session');
var passport = require('passport');


//DB//
var User = require('./models/user');
var Room = require('./models/room');
User.sync();
Room.sync();

//認証//
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

//routesファイル//
var indexRouter = require('./routes/index');
var roomRouter = require('./routes/room');

var app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//セッション//
app.use(session({ secret: `${Config.Pass_Add.Session_Secret}`, resave: false, saveUninitialized: false }));

app.use(passport.initialize()); //初期化
app.use(passport.session());


//ルート//
app.use('/', indexRouter);
app.use('/room', roomRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
