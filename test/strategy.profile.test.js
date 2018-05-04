/* global describe, it, before, expect */
/* jshint expr: true */

var EveOnlineSsoStrategy = require('../lib/strategy'),
    InternalOAuthError = require('passport-oauth2').InternalOAuthError;

describe('Strategy#userProfile', function() {

  describe('fetched from default endpoint', function() {
    var strategy = new EveOnlineSsoStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        callbackURL: 'https://www.example.com/oath/callback'
      }, function() {});

    strategy._oauth2.get = function(url, accessToken, callback) {
      if (url != 'https://login.eveonline.com/oauth/verify') { return callback(new Error('incorrect url argument')); }
      if (accessToken != 'token') { return callback(new Error('incorrect token argument')); }
      var body = {
          'CharacterID'       : 95158478,
          'CharacterName'     : 'Johnny Splunk',
        };
      callback(null, JSON.stringify(body), undefined);
    };

    var profile;

    before(function(done) {
      strategy.userProfile('token', function(err, p) {
        if (err) { return done(err); }
        profile = p;
        done();
      });
    });

    it('should parse profile', function() {
      expect(profile.provider).to.equal('eveonline-sso');
      expect(profile.CharacterID).to.equal(95158478);
      expect(profile.CharacterName).to.equal('Johnny Splunk');
    });

    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });

    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  }); // fetched from default endpoint

  describe('error caused by malformed response', function() {
    var strategy =  new EveOnlineSsoStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        callbackURL: 'https://www.example.com/oath/callback'
      }, function() {});

    strategy._oauth2.get = function(url, accessToken, callback) {
      var body = 'Hello, world.';
      callback(null, body, undefined);
    };

    var err, profile;

    before(function(done) {
      strategy.userProfile('token', function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });

    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('Failed to parse character profile.');
    });
  }); // error caused by malformed response

  describe('error caused by error response', function() {
    var strategy =  new EveOnlineSsoStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        callbackURL: 'https://www.example.com/oath/callback'
      }, function() {});

    strategy._oauth2.get = function(url, accessToken, callback) {
      var e = new InternalOAuthError('Failed to parse character profile.');
      callback(e, undefined, undefined);
    };

    var err, profile;

    before(function(done) {
      strategy.userProfile('token', function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });

    it('should error', function() {
      expect(err).to.be.an.instanceOf(InternalOAuthError);
      expect(err.message).to.equal('Failed to parse character profile.');
    });
  }); // error caused by malformed response

});