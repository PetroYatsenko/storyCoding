const mongoose = require('mongoose');

const monsterSchema = new mongoose.Schema({
  monster: { type: String, match: /[a-z,A-Z]/, unique: true },
  name_uk: { type: String, default: "Noname", match: /[a-z,A-Z]/ },
  talent_uk: { type: String, default: 'None', match: /[a-z,A-Z]/ },          
  enabled: { type: Boolean },
  build_uk: { type: String },
});

const Monster = mongoose.model('Monster', monsterSchema);

module.exports = Monster; 