/**
 * Parse profile.
 */
exports.parse = function(json) {

  var profile = {};

  profile.TokenType = json.TokenType;
  profile.ExpiresOn = new Date(json.ExpiresOn);
  profile.Scopes = json.Scopes;
  profile.IntellectualProperty = json.IntellectualProperty;
  profile.CharacterID = json.CharacterID || null;
  profile.CharacterName = json.CharacterName || null;
  profile.CharacterOwnerHash = json.CharacterOwnerHash || null;

  return profile;
};