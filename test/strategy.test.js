/* global describe, it, expect, before */
/* jshint expr: true */

var EveOnlineSsoStrategy = require('../lib/strategy')
  , chai = require('chai');


describe('Strategy#constructed', function() {

  describe('with normal options', function() {
    var strategy = new EveOnlineSsoStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        callbackURL: 'https://www.example.com/oath/callback'
      },
      function() {});
    
    it('should be named eveonline-sso', function() {
      expect(strategy.name).to.equal('eveonline-sso');
    });
  });

  describe('with undefined options', function() {
    it('should throw', function() {
      expect(function() {
        var strategy = new EveOnlineSsoStrategy(undefined, function(){});
      }).to.throw(Error);
    });
  }); // with undefined options

});