var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');

const Git_Twe_Add_pass = require('./config');

var session = require('express-session');
var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;
var Strategy = require('passport-twitter').Strategy;


passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(new GitHubStrategy({
  clientID: Git_Twe_Add_pass.Pass_Add.Git_Id,
  clientSecret: Git_Twe_Add_pass.Pass_Add.Git_Sec,
  callbackURL: Git_Twe_Add_pass.Git_collback_Address
},
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

passport.use(new Strategy({
    consumerKey: Git_Twe_Add_pass.Pass_Add.Twi_Id,
    consumerSecret: Git_Twe_Add_pass.Pass_Add.Twi_Sec,
    callbackURL: Git_Twe_Add_pass.Twi_collback_Address
  },
  function(token, tokenSecret, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  })
);

var indexRouter = require('./routes/index');

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

app.use(session({ secret: Git_Twe_Add_pass.Pass_Add.session_Secret, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);

app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }),
  function (req, res) {
});

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect('/');
});

app.get('/auth/twitter',
  passport.authenticate('twitter', { scope: ['user:email']})
);

app.get('/auth/tweeter/callback',
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/logout', function (req, res) {
  req.logout();
    res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

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
