const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  story: { type: String, match: /[a-z,A-Z]/ },
  type: {type: String, match: /[a-z,A-Z]/},
  items_uk: { type: Array, match: /[a-z,A-Z]/ },
  state_uk: {type: Object},
});

const Story = mongoose.model('Story', storySchema);

module.exports = Story;
