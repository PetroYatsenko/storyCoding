const Monster = require('../models/Monster');
const Story = require('../models/Story');
const UserStory = require('../models/UserStory');
const Steps = require('../models/Step');
const LessonsList = require('../models/LessonsList');
const Promise = require('bluebird');

var lang = 'uk';//TODO lang support
var state = 'state_' + lang; 
var items = 'items_' + lang;

exports.lesson = (req, res, next) => {
  req.sanitize('monster');
  
  var query = {
    story: req.params.monster, 
    type: 'lesson'
  }; 
     
  Promise.all([
    Steps.findOne(query),
    Story.findOne(query)
  ]).spread(function(steps, story) {    
    res.render('13_stories/lesson', { 
      title: story[state].title,
      subject: story[state].subject, // What do we studying? (loops)
      h1: story[state].h1,
      h1_act: story[state].h1_act,
      h2: story[state].h2,
      h2_act: story[state].h2_act,
      h3: story[state].h3,
      h3_act: story[state].h3_act,
      h4: story[state].h4,
      h4_act: story[state].h4_act,
      img1: story[state].img1,
      img2: story[state].img2,
      story_items: story[items],     
      steps: JSON.stringify(steps.steps).replace(/<\//g, "<\\/"),
      next: JSON.stringify(steps.next_path),
    });
  });
};

exports.explanation = (req, res, next) => {
  var query = { //TODO replace monster with param
    story: 'pompon_monster', 
    type: 'explanation'
  };
  
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
    });  
  });
};

exports.dashboard = (req, res, next) => {  
  var query = {
    enabled: true
  };
  
  LessonsList.find(query).then(function(d) {
    // console.log(d); TODO adjust
    res.render('dashboard', {
      title: 'Твій прогрес',
//      vars: d[state]
    });
  });
};

