# passport-eveonline-sso

[Passport](http://passportjs.org/) strategy for authenticating with [EVE Online](http://wwww.eveonline.com/)
using the OAuth 2.0 API.

This module lets you authenticate using EVE Online SSO in your Node.js applications.
By plugging into Passport, EVE Online SSO authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install eve-scout/passport-eveonline-sso

## Usage

#### Create an Application

Before using `passport-eveonline-sso`, you must register your application with
[EVE Online Developers site](https://developers.eveonline.com/)

You will also need to configure an Endpoint redirect URI (`callbackURL`) and scopes your application has access to.

#### Configure Strategy

The EVE Online SSO authentication strategy authenticates users using a EVE Online
account and OAuth 2.0 tokens.  The clientID and clientSecret obtained when creating an
application are supplied as options when creating the strategy.  The strategy
also requires a `verify` callback, which receives the access token and optional
refresh token, as well as `profile` which contains the authenticated user's
SeAT profile.  The `verify` callback must call `cb` providing a user to
complete authentication.

```js
passport.use(new EveOnlineSsoStrategy({
    clientID: EVEONLINE_CLIENT_ID,
    clientSecret: EVEONLINE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/oauth2/callback'
    scope: ''
  },
  function(accessToken, refreshToken, profile, cb) {
    return done(null, profile);
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'eveonline-sso'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.get('/auth/eveonline',
  passport.authenticate('eveonline-sso'));

app.get('/auth/eveonline/callback',
  passport.authenticate('eveonline-sso', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```

## Example

For a working example refer to examples/login.

To demo, complete the following from the command line.

```bash
$ cd examples/login
$ npm install
$ node app.js
```

Follow instructions from the output and browse to http://localhost:3000

## Tests

The test suite is located in the `test/` directory.  All new features are
expected to have corresponding test cases.  Ensure that the complete test suite
passes by executing:

```bash
$ make test
```

## Coverage

The test suite covers 100% of the code base.  All new feature development is
expected to maintain that level.  Coverage reports can be viewed by executing:

```bash
$ make test-cov
$ make view-cov
```

## Credits

  - [Johnny Splunk](http://github.com/johnnysplunk)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2018 Johnny Splunk of EVE-Scout <[https://twitter.com/eve_scout](https://twitter.com/eve_scout)>