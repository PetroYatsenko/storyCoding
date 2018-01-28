const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  chapter: {type: String},
  number: {type: Number},
  subj: {type: String},
  name: {type: String},
  practice: {type: Object},
  enabled: {type: Boolean},
  state_uk: {
    name: String,
    subname: String
  }
});

module.exports = mongoose.model('Lesson', lessonSchema);


