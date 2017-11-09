const mongoose = require('mongoose');

const stepsSchema = new mongoose.Schema({
  story_id: {type: String},
  steps: [{type: Mixed}]
});

const Steps = mongoose.model('Steps', stepsSchema);

module.exports = Steps;