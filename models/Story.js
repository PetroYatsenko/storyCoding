const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  story: { type: String, match: /[a-z,A-Z]/ },
  items_uk: { type: Array, match: /[a-z,A-Z]/ },
  build_uk: { type: Array, match: /[a-z,A-Z]/ },
  enabled: { type: Boolean },
});

module.exports = mongoose.model('Story', storySchema);

