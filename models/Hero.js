const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  hero: { type: String, match: /[a-z,A-Z]/, unique: true },
  name_uk: { type: String, default: "Noname", match: /[a-z,A-Z]/ },
  talent_uk: {type: String, default: 'None', match: /[a-z,A-Z]/},          
  enabled: { type: Boolean },
  role: { type: String }
});

module.exports = mongoose.model('Heroes', heroSchema);
