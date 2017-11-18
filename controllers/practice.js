const Monster = require('../models/Monster');
const Step = require('../models/Step');
const Story = require('../models/Story');
const Promise = require('bluebird');


exports.getHeroes = (req, res, next) => {
  var query = {};
  var lesson = 'з циклом'; //TODO
  
  //TODO add query or remove Promise.all 
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
  var query = {story: mr, type: 'practice'};
  var lang = 'uk'; //TODO language support
  var trials = 'чотирьох кроків'; //TODO  
  var state = 'state_' + lang; 
  var items = 'items_' + lang;
    
  Promise.all([
    Step.findOne(query),
    Story.findOne(query),
    Monster.findOne({monster: mr})
  ]).spread(function(steps, story, monster) {

    for (let i = 0; i < story[items].length; i++) {
      story[items][i] = exports.replacePlaceholders({trials: trials}, story[items][i]);
    } 
    
    res.render('13_stories/story_builder', {
      title: story[state].title + monster.name_uk,
      you_can: story[state].you_can, //TODO take from db + lang support
      monster_img: monster.monster + '_large',
      story_items: story[items],      
      go_ahead: story[state].go_ahead,
      stop: story[state].stop,
      help: story[state].help,
      look_around: story[state].look,
      step_loop: story[state].loop,
      smb_can: story[state].smb_can,
      steps: JSON.stringify(steps.steps).replace(/<\//g, "<\\/"),
      put_your_text: 'Пиши тут...',
      loop_txt: 'Лічильник'
    });
  });
};

