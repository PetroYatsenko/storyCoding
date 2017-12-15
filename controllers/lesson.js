const Monster = require('../models/Monster');
const Story = require('../models/Story');
const Steps = require('../models/Step');
const Promise = require('bluebird');

var lang = 'uk';//TODO lang support

exports.pomponMonster = (req, res, next) => {
  var query = { //TODO replace monster with param
    story: 'pompon_monster', 
    type: 'lesson'
  }; 
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
      explanation: JSON.stringify(steps.next_path),
    });
  });
};

exports.explanation = (req, res, next) => {
  var query = { //TODO replace monster with param
    story: 'pompon_monster', 
    type: 'explanation'
  }; 
  var state = 'state_' + lang; 
  var items = 'items_' + lang;
  
  Story.findOne(query).then(function(d) {
    res.render('13_stories/explanation', {        
        goto: JSON.stringify(d.next_path),
        img: d.img,
        title: d[state].title,
        heroes_talents: d[state].talents,
        heroes: d[state].heroes,
        expl_items: d[items],
        you_can: d[state].you_can,
        your_talent: d[state].your_talent,
        subject: d[state].subject
      }
    );  
  });
}

exports.dashboard = (req, res, next) => {
  res.render('dashboard', {
    title: 'Твій прогрес'
  });
}

