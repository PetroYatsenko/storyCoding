const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  chapter: {type: String, match: /[a-z,A-Z]/},
  number: {type: Number},
  subj: {type: String, match: /[a-z,A-Z]/},
  name: {type: String, match: /[a-z,A-Z]/},
  monsters: {
    basic: {type: Array, match: /[a-z,A-Z]/},
    advanced: {type: Array, match: /[a-z,A-Z]/},
    premium: {type: Array, match: /[a-z,A-Z]/}
  },
  enabled: {type: Boolean},
  state_uk: {
    name: String,
    subname: String
  }
});

module.exports = mongoose.model('Lesson', lessonSchema);


