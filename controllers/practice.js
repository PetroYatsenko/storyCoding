const Monster = require('../models/Monster');
const Hero = require('../models/Hero');
const Promise = require('bluebird');


exports.getHeroes = (req, res, next) => {
  var query = {};
     
  Promise.all([
    Monster.find(query),
    Hero.find(query)
  ]).spread(function(zoo, heroes) {      
      res.render('13_stories/select_heroes', {
        title: 'Починаємо вигадувати',
        description: 'Спочатку вибери монстра та героїв своєї історії',
        select_hero_1: 'Вибери першого героя.', //TODO: or add yours hero
        select_hero_2: 'Вибери другого героя.',
        monsters_zoo : zoo,
        monsters_collection: 'Зоопарк монстрів',
        your_talent: 'Ти можеш',      
        your_action: 'Почати свою історію!',
        heroes: heroes
      });
    });
};

exports.replacePlaceholders = function(val, str) {
  var replaced = "";
  var parts = str.split(/(\%\w+?\%)/g).map(function(v) {
    replaced = v.replace(/\%/g,"");
    return val[replaced] || replaced; 
  });

  return parts.join("");
};

exports.getLoopBuilder = (req, res, next) => {
  req.sanitize('mr', 'fh', 'sh'); //TODO figure out sanitization
  
  var mr = req.query.mr, 
    fh = req.query.fh,
    sh = req.query.sh;
    
  Monster.findOne({monster: mr}).then(function(mr) {
    res.render('13_stories/story_builder', {
      title: 'Історія з монстром ' + mr.name_uk,
      first_hero_can: exports.replacePlaceholders({first_hero: fh}, 'Що %first_hero% буде робити?'),
      second_hero_can: exports.replacePlaceholders({second_hero: sh}, 'Що %second_hero% буде робити?'),
      monster_img: mr.monster + '_large',
      put_your_text: exports.replacePlaceholders({trials: '4 спроби'}, mr.build_uk),      
      your_action: 'Пишемо далі!',
    });
  });
};

