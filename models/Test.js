const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  name: { type: String},
  topic: {type: String},
  state_uk: {
    test: {type: Array},
    subtitle: {type: String}
  },
});

module.exports = mongoose.model('Test', testSchema);