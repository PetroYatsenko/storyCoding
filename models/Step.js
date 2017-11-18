const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
  story: {type: String},
  type: {type: String, match: /[a-z,A-Z]/},
  steps: {type: Array},
  next_path: {type: String}
});

const Step = mongoose.model('Step', stepSchema);

module.exports = Step;