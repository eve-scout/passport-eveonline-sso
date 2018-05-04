/**
 * Parse profile.
 */
exports.parse = function(json) {

  var profile = {
      CharacterID: json.CharacterID,
      CharacterName: json.CharacterName,
      ExpiresOn: new Date(json.ExpiresOn),
      Scopes: json.Scopes,
      TokenType: json.TokenType,
      CharacterOwnerHash: json.CharacterOwnerHash
  };

  return profile;
};