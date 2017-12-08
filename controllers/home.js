const Monster = require('../models/Monster');

exports.index = (req, res) => {
  var query = {};
  
  Monster.find(query).then(function(monsters) {
    res.render('home', {
      title: 'Home',
      monsters: monsters
    });
  });
};
