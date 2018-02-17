const Monster = require('../models/Monster');

exports.index = (req, res) => {
  var state = 'state_' + res.locals.lang; 
  
  Monster.find({enabled: true}, {enabled: 0, _id: 0}).then(function(monsters) {
    res.render('home', {
      title: 'Home',
      state: state,
      monsters: monsters
    });
  });
};