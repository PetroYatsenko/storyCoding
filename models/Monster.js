const mongoose = require('mongoose');

const monsterSchema = new mongoose.Schema({
  monster: { type: String, match: /[a-z,A-Z]/, unique: true },
  state_uk: { type: Object },         
  enabled: { type: Boolean },
});

const Monster = mongoose.model('Monster', monsterSchema);

module.exports = Monster; 