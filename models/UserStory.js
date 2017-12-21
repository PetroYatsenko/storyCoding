const mongoose = require('mongoose');

const userStorySchema = new mongoose.Schema({
  story: {type: String},  
  hero: {type: String},
  userId: {type: String},
  trials: {type: Number, min: 0, max: 10, default: 0}
},
{
  timestamps: true
});

module.exports = mongoose.model('UserStory', userStorySchema);


