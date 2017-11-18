const Monster = require('../models/Monster');
const Story = require('../models/Story');
const Steps = require('../models/Step');
const Promise = require('bluebird');

var lang = 'uk';//TODO lang support

exports.pomponMonster = (req, res, next) => {
  var query = { story: 'pompon_monster', type: 'lesson'}; //TODO replace monster with param
  var state = 'state_' + lang; 
  var items = 'items_' + lang;
    
  Promise.all([
    Steps.findOne(query),
    Story.findOne(query)
  ]).spread(function(steps, story) {    
    res.render('13_stories/pompon_monster', { 
      title: story[state].title, 
      story_name: story[state].name,
      subject: story[state].subject, // What do we studying? (loops)
      boy_talent: story[state].boy_talent,
      boy_action: story[state].boy_action,
      mom_talent: story[state].mom_talent,
      mom_action: story[state].mom_action,
      your_talent: story[state].your_talent,
      your_action: story[state].your_action,
      boy_hat: story[state].boy_hat,
      greetings: story[state].greetings,
      story_items: story[items],
      monster_talent: story[state].monster_talent,
      monster_action: story[state].monster_action,
      monster_danger: story[state].monster_danger,
      steps: JSON.stringify(steps.steps).replace(/<\//g, "<\\/"),
      know_how: JSON.stringify(steps.next_path),
    });
  });
};

exports.howPomponMade = (req, res, next) => {
  res.render('13_stories/pompon_how_its_made', 
    {
      title: 'Як зроблена історія про балабонового монстра?',
      heroes_can: 'Пригадаємо, що вміють персонажі:',
      monster_talent: 'Балабоновий Монстр',
      monster_action: 'утворюється з чотирьох балабонів і поглинає весь світ',
      boy_talent: 'Левко',
      boy_action: 'уміє відгризти балабон',
      mom_talent: 'Мама',
      mom_action: 'уміє пришити балабон',
      your_talent: 'Ти можеш',
      your_action: 'Написати історію з циклом',
      about_this_story: 'Аби написати історію про монстра, Галина Ткачук\
        скористалася циклом -- повторенням подібних подій із несподіваним завершенням.',
      explanation_1: 
        'Мама та син пришивають та відривають балабони кілька разів.\
        Такі послідовності називають "циклами".',
      explanation_2:
        'Балабоновий монстр з\'являється, коли разом збираються чотири балабони. \
        Цикл завершується, коли Балабоновий монстр пожирає весь світ. \.',
      explanation_3:
        'Кожен цикл повинен мати умову його завершення. Інакше цикл триватиме нескінченно довго!',
      select_heroes_link: '/practice/heroes'
    }
  );
}


