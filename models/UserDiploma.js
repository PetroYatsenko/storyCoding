const mongoose = require('mongoose');

const userDiplomaSchema = new mongoose.Schema({
  d_title: {type: String},
  d_story: {type: String},
  userId: {type: String}
},
{
  timestamps: true
});

module.exports = mongoose.model('UserDiploma', userDiplomaSchema);


