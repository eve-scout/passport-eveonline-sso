/**
 * Parse profile.
 */
exports.parse = function(json, scope) {

  var profile = {};

  var subParts = json.sub.split(':');

  profile.TokenType = 'Character';
  profile.ExpiresOn = new Date(json.exp * 1000);
  profile.Scopes = scope;
  profile.IntellectualProperty = subParts[1];
  profile.CharacterID = parseInt(subParts[2]) || null;
  profile.CharacterName = json.name || null;
  profile.CharacterOwnerHash = json.owner || null;

  return profile;
};