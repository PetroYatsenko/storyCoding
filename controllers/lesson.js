const Monster = require('../models/Monster');
const Story = require('../models/Story');
const UserStory = require('../models/UserStory');
const Steps = require('../models/Step');
const Lesson = require('../models/Lesson');
const genFunc = require('./gen_functions');
const Promise = require('bluebird');

var lang = 'uk';//TODO lang support
var state = 'state_' + lang; 
var items = 'items_' + lang;

exports.tutorial = (req, res, next) => {
  res.render('13_stories/tutorial', {
    title: 'Як побудовані наші уроки', //TODO
    nextPath: JSON.stringify('/lessons/transparent_dude/simple_var') //TODO
  });  
}; 

exports.lesson = (req, res, next) => {
  req.sanitize('monster');
  req.sanitize('subj');
  // Important! Use session story name further
  req.session.story_name = req.params.monster;
  req.session.subject = req.params.subj;
  
  var query = {
    story: req.session.story_name, 
    type: 'lesson'
  }; 
     
  Promise.all([
    Steps.findOne(query),
    Story.findOne(query)
  ]).spread(function(steps, story) {
    res.render('13_stories/lesson', { 
      title: story[state].title,
      subject: story[state].subject,
      h1: story[state].h1,
      h1_act: story[state].h1_act,
      h2: story[state].h2,
      h2_act: story[state].h2_act,
      h3: story[state].h3,
      h3_act: story[state].h3_act,
      h4: story[state].h4,
      h4_act: story[state].h4_act,
      img1_t: story[state].img1_t,
      img2_t: story[state].img2_t,        
      img1: story[state].img1,
      img2: story[state].img2,
      story_items: story[items],     
      steps: JSON.stringify(steps.steps).replace(/<\//g, "<\\/"),
      next_path: genFunc.getNextPath(story.type),
      next_btn: JSON.stringify('h4') //TODO move to DB (see practice too)
    });
  });
};

exports.explanation = (req, res, next) => {
  var query = {
    story: req.session.story_name, 
    type: 'explanation'
  };
  
  Story.findOne(query).then(function(d) {
    res.render('13_stories/explanation', {
      img: d.img,
      img_txt: d[state].img_txt,
      title: d[state].title,
      expl_items: d[items],
      you_can: d[state].you_can,
      your_act: d[state].your_act,
      subject: d[state].subject,
      next_path: genFunc.getNextPath(d.type),
    });  
  });
};

exports.dashboard = (req, res, next) => {  
  var query = {
    enabled: true
  };
  
  Lesson.find(query).then(function(d) {
    // console.log(d); TODO adjust
    res.render('dashboard', {
      title: 'Твій прогрес',
//      vars: d[state]
    });
  });
};

