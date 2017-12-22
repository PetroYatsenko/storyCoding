const mongoose = require('mongoose');

const lessonsListSchema = new mongoose.Schema({
  state_uk: {
    name: String,
    subname: String,
    topic: String,
  },    
  path: String,
  enabled: Boolean
});

module.exports = mongoose.model('LessonsList', lessonsListSchema);


