const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
  story: {type: String},
  steps: {type: Array}
});

const Step = mongoose.model('Step', stepSchema);

module.exports = Step;