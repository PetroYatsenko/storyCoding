const mongoose = require('mongoose');

const userStorySchema = new mongoose.Schema({
  lesson: {type: String},
  hero: {type: String},
  story_txt: {type: String},
  userId: {type: String}
},
{
  timestamps: true
});

module.exports = mongoose.model('UserStory', userStorySchema);


