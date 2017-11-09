const mongoose = require('mongoose');
const monsterSchema = new mongoose.Schema({
  id: { type: String, default: "zero", match: /[a-z,A-Z]/, unique: true },
  name: { type: String, default: "Noname", match: /[a-z,A-Z]/ },
  img: { type: String, default: "default_img", match: /[a-z,A-Z,0-9_]/ },
  talent: {type: String, default: 'None', match: /[a-z,A-Z]/},          
  enabled: { type: Number, min: 0, max: 1 }
});

const Monster = mongoose.model('Monster', monsterSchema);

module.exports = Monster;


