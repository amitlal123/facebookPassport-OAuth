//Dependencies
var express = require('express');
var session = require('express-session');
//var cors = require('cors');
//var bodyParser = require('body-parser');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./config');
//Middleware
var app = express();
//app.use(cors());
//app.use(bodyParser.json());
app.use(session({secret: config.sessionSecret,
  resave: true,
  saveUninitialized: true}));

app.use(passport.initialize());
app.use(passport.session());

//Facebook Strategy
passport.use(new FacebookStrategy({
  clientID : config.appId,
  clientSecret : config.appSecret,
  callbackURL : 'http://localhost:3000/auth/facebook/callback'
}, function(token, refreshtoken, profile, done){
    return done(null, profile);
}));

// Endpoints
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect : '/auth/me',
  failureRedirect: '/login'
}));

function requireAuth(req, res, next) {
  if(req.isAuthenticated()){
    next();
  } else {
    res.redirect('http://localhost:3000/login')
  }
}
app.get('/auth/me', requireAuth, function(req, res){
  res.send(req.user);
});
app.get('/login', function(req, res){
  res.send('Welcome');
});
//Serialize/deserialize
passport.serializeUser(function(user, done){
  return done(null, user);
});

passport.deserializeUser(function(obj, done){
  return done(null, obj);
});

//Start Node app
app.listen(3000, function(){
  console.log('Listening on port 3000');
});
