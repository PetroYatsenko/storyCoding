const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  name: { type: String},
  img: {type: String},
  topic: {type: String},
  items_uk: {type: Array},
  state_uk: {type: Object},
});

module.exports = mongoose.model('Test', testSchema);