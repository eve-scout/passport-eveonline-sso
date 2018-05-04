/* global describe, it, expect, before */
/* jshint expr: true */

var EveOnlineSsoStrategy = require('../lib/strategy')
  , chai = require('chai');

describe('Strategy#authorization', function() {

  describe('authorization request', function() {
    var strategy = new EveOnlineSsoStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        callbackURL: 'https://www.example.com/oath/callback'
    }, function() {});
    
    var url;
  
    before(function(done) {
      chai.passport.use(strategy)
        .redirect(function(u) {
          url = u;
          done();
        })
        .req(function(req) {
          req.session = {};
        })
        .authenticate();
    });
  
    it('should be redirected', function() {
      expect(url).to.equal('https://login.eveonline.com/oauth/authorize?response_type=code&redirect_uri=https%3A%2F%2Fwww.example.com%2Foath%2Fcallback&client_id=ABC123');
    });
  }); // authorization request

});