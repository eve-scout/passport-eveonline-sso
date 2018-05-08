const express = require('express')
  , passport = require('passport')
  , util = require('util')
  , EveOnlineSsoStrategy = require('passport-eveonline-sso').Strategy;

const EVEONLINE_SSO_CLIENT_ID = 'yourAppKey';
const EVEONLINE_SSO_CLIENT_SECRET = 'yourAppSecret';
const EVEONLINE_SSO_CALLBACK_URL = 'http://localhost:' + (process.env.PORT || 3000) + '/auth/eveonline/callback';
const EVEONLINE_SSO_SCOPES = '';

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete EVE Online profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the EveOnlineSsoStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and EVE Online Character
//   profile), and invoke a callback with a user object.
passport.use(new EveOnlineSsoStrategy({
    clientID: EVEONLINE_SSO_CLIENT_ID,
    clientSecret: EVEONLINE_SSO_CLIENT_SECRET,
    callbackURL: EVEONLINE_SSO_CALLBACK_URL,
    scope: EVEONLINE_SSO_SCOPES
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's EVE Online Character profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the EVE Online Character with a user record in your database,
      // and return that user instead.

      // You could save the tokens to a database and/or call EVE Swaggger Interface (ESI) resources.
      // If you desire to use ESI, be sure to configure your application at https://developers.eveonline.com/applications)
      // and specify your scopes with EVEONLINE_SSO_SCOPES

      // The refreshToken will only be set if you are using scopes

      console.log('=== New Login ===');
      console.log('accessToken:', accessToken);
      console.log('refreshToken:', refreshToken);
      console.log('profile:', profile);

      return done(null, profile);
    });
  }
));


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }

  res.redirect('/login')
}

// Configure Express

// Create a new Express application.
var app = express();
app.set('port', process.env.PORT || 3000);

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
// app.use(require('cookie-parser')());
// app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
  res.render('index', { user: req.user });
});

app.get('/profile', ensureAuthenticated, function(req, res) {
  res.render('profile', { user: req.user });
});

app.get('/login', function(req, res) {
  res.render('login', { user: req.user });
});

// GET /auth/eveonline
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in EVE Online authentication will involve
//   redirecting the user to EVE Online.  After authorization, EVE Online
//   will redirect the user back to this application at /auth/eveonline/callback
//   This path can be almost anything.
app.get('/auth/eveonline',
  passport.authenticate('eveonline-sso'),
  function(req, res){
    // The request will be redirected to EVE Online for authentication, so this
    // function will not be called.
  });

// GET /auth/eveonline/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
//   This path is the same as specified in the application on the
//   EVE Online Developers site. This is also the same as your callbackURL.
app.get('/auth/eveonline/callback', 
  passport.authenticate('eveonline-sso', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
  console.log('');
  console.log('Be sure to setup the OAuth2 client in EVE Online SSO with the following:')
  console.log('');
  console.log('Client ID:', EVEONLINE_SSO_CLIENT_ID);
  console.log('Client Secret:', EVEONLINE_SSO_CLIENT_SECRET);
  console.log('CallbackURL:', EVEONLINE_SSO_CALLBACK_URL);
  console.log('Scopes:', EVEONLINE_SSO_SCOPES)
});