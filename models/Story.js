const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  story: { type: String, match: /[a-z,A-Z]/ },
  type: {type: String, match: /[a-z,A-Z]/},
  hero: {type: String}, // Used for type Practice only
  img: {type: String},
  topic: {type: String},
  subject: {type: String},
  items_uk: { type: Array, match: /[a-z,A-Z]/ },
  state_uk: {type: Object},
});

module.exports = mongoose.model('Story', storySchema);