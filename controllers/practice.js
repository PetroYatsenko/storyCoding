const Monster = require('../models/Monster');
const Step = require('../models/Step');
const Story = require('../models/Story');
const Promise = require('bluebird');


exports.getHeroes = (req, res, next) => {
  var query = {};
  var lesson = 'з циклом'; //TODO
     
  Promise.all([
    Monster.find(query)
  ]).spread(function(zoo) {      
      res.render('13_stories/select_heroes', {
        title: 'Починаємо вигадувати історію ' + lesson, 
        description: 'Спочатку вибери монстра своєї історії',
        monsters_zoo : zoo,
        monsters_collection: 'Колекція монстрів',
        your_talent: 'Ти можеш',      
        your_action: 'Почати свою історію!'
      });
    });
};

// TODO move to general functions
exports.replacePlaceholders = function(val, str) {
  var replaced = "";
  var parts = str.split(/(\%\w+?\%)/g).map(function(v) {
    replaced = v.replace(/\%/g,"");
    return val[replaced] || replaced; 
  });

  return parts.join("");
};

exports.getLoopBuilder = (req, res, next) => {
  req.sanitize('mr'); //TODO figure out sanitization  
  var mr = req.query.mr;
  
  Promise.all([
    Step.findOne({story: mr}),
    Monster.findOne({monster: mr})
  ]).spread(function(steps, mr) {
    console.log('---------');
    console.log(steps);
    console.log('---------');
    res.render('13_stories/story_builder', {
      title: 'Ти і ' + mr.name_uk,
      you_can: 'Ти можеш:', //TODO take from db + lang support
      monster_img: mr.monster + '_large',
      put_your_text: exports.replacePlaceholders({trials: '4 спроби'}, mr.build_uk),      
      go_ahead: 'Пишемо далі!',
      start: 'Рушити!', 
      stop: 'Зупинити!',
      help: 'Кликати на допомогу',
      look_around: 'Дивитися навкруги',
      step_loop: 'zero',
      smb_can: 'Хтось може:',
      steps: JSON.stringify(steps.steps).replace(/<\//g, "<\\/")
    });
  });
};

