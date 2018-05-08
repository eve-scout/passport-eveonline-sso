/* global describe, it, before, expect */
/* jshint expr: true */

var EveOnlineSsoStrategy = require('../lib/strategy'),
    InternalOAuthError = require('passport-oauth2').InternalOAuthError;

describe('Strategy#userProfile', function() {

  describe('fetched from default endpoint with character token', function() {
    var strategy = new EveOnlineSsoStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        callbackURL: 'https://www.example.com/oath/callback'
      }, function() {});

    strategy._oauth2.get = function(url, accessToken, callback) {
      if (url != 'https://login.eveonline.com/oauth/verify') { return callback(new Error('incorrect url argument')); }
      if (accessToken != 'token') { return callback(new Error('incorrect token argument')); }
      var body = {
          TokenType: 'Character',
          Scopes: '',
          ExpiresOn: '2018-05-08T19:50:08',
          IntellectualProperty: 'EVE',
          CharacterID: 95158478,
          CharacterName: 'Johnny Splunk',
          CharacterOwnerHash: 'Y99STz2ksMHxGrkREO5FAlZVhik='
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
      expect(profile.CharacterOwnerHash).to.equal('Y99STz2ksMHxGrkREO5FAlZVhik=');
      expect(profile.TokenType).to.equal('Character');
      expect(profile.Scopes).to.equal('');
      expect(profile.ExpiresOn.toString()).to.equal(new Date('2018-05-08T19:50:08').toString());
      expect(profile.IntellectualProperty).to.equal('EVE');
    });

    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });

    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  }); // fetched from default endpoint

  describe('fetched from default endpoint with user token', function() {
    var strategy = new EveOnlineSsoStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        callbackURL: 'https://www.example.com/oath/callback'
      }, function() {});

    strategy._oauth2.get = function(url, accessToken, callback) {
      if (url != 'https://login.eveonline.com/oauth/verify') { return callback(new Error('incorrect url argument')); }
      if (accessToken != 'token') { return callback(new Error('incorrect token argument')); }
      var body = {
        TokenType: 'User',
        Scopes: '',
        ExpiresOn: '2018-05-08T19:50:08',
        IntellectualProperty: 'EVE'
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
      expect(profile.TokenType).to.equal('User');
      expect(profile.Scopes).to.equal('');
      expect(profile.ExpiresOn.toString()).to.equal(new Date('2018-05-08T19:50:08').toString());
      expect(profile.CharacterID).to.equal(null);
      expect(profile.CharacterName).to.equal(null);
      expect(profile.CharacterOwnerHash).to.equal(null);
      expect(profile.IntellectualProperty).to.equal('EVE');
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