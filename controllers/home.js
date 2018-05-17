const Monster = require('../models/Monster');

exports.index = (req, res) => {
  var query = {enabled: true};
  var q_param = {enabled: 0, _id: 0};
  var state = 'state_' + res.locals.lang; 
  
  Monster.find(query, q_param).then(function(monsters) {
    res.render('home', {
      title: 'Home', // TODO
      state: state,
      monsters: monsters
    });
  });
};

exports.userAgreement = (req, res, next) => {
  res.render('user_agreement');
};