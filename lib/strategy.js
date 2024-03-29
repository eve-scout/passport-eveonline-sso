'use strict';

/**
 * Module dependencies.
 */
var util = require('util'),
    OAuth2Strategy = require('passport-oauth2'),
    jwt = require('jsonwebtoken'),
    InternalOAuthError = require('passport-oauth2').InternalOAuthError,
    Profile = require('./profile');

/**
 * `Strategy` constructor.
 *
 * The EVE Online SSO authentication strategy authenticates requests by delegating to
 * EVE Online SSO using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your EVE Online SSO application's app key found in the App Console
 *   - `clientSecret`  your EVE Online SSO application's app secret
 *   - `callbackURL`   URL to which SeAT will redirect the user after granting authorization
 *   - `scope`         Scopes to grant access to. Optional.
 *
 * Examples:
 *
 *     passport.use(new EveOnlineSsoStrategy({
 *         clientID: 'yourAppKey',
 *         clientSecret: 'yourAppSecret'
 *         callbackURL: 'https://www.example.net/oauth2/callback',
 *         scope: 'character.profile,character.roles,email'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};

  options.authorizationURL = 'https://login.eveonline.com/v2/oauth/authorize';
  options.tokenURL = 'https://login.eveonline.com/v2/oauth/token';
  options.state = true;

  OAuth2Strategy.call(this, options, verify);

  this.name = 'eveonline-sso';
  this._oauth2.useAuthorizationHeaderforGET(true);
  this._options = options;
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from EVE Online SSO.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`            always set to `eveonline-sso`
 *   - `CharacterID`         the character's ID
 *   - `CharacterName`       the character's Name
 *   - `ExpiresOn`           the token expiration id
 *   - `Scopes`              the token scopes
 *   - `TokenType`           the token type
 *   - `CharacterOwnerHash`  the characters's CharacterOwnerHash will change if the character is transferred to a different user account
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  var self = this;

  const json = jwt.decode(accessToken);

  var profile = Profile.parse(json, 'Character', self._options.scope);
  profile.provider = 'eveonline-sso';
  profile._raw = accessToken;
  profile._json = json;

  done(null, profile);
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;