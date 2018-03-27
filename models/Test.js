const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  name: { type: String},
  topic: {type: String},
  state_uk: {type: Object},
});

module.exports = mongoose.model('Test', testSchema);