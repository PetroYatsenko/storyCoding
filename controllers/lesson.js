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
  var lesson = {
    enabled: true
  };
  var param = {
    chapter: 1, 
    subj: 1, 
    name: 1, 
    _id: 0
  };
  // Language var
  param[state] = 1;
  
  // TODO get from state_uk messages table
  var strings = {
    state_uk: {
      title: 'Твій прогрес',
      stories: 'історій: ',
      dash_title: 'Вивчаємо з монстрами...',
      test: 'Закріпляємо навички',
      vars: 'Змінні',
      cond: 'Умови',
      loop: 'Цикли',
      func: 'Функції',
      trials: 'Монстри',
      tooltip: {
        trials: 'Монстри, задіяні у твоїх історіях'
      },
      diploma: 'Отримай диплом',
      next: 'Зараз'
    }
  }
  // TODO -- wether move it somewhere?
  var chapters = ['vars', 'cond', 'loop', 'func'];
  
  Promise.all([
    UserStory.aggregate([
      {$match: {userId: req.user.id}}, 
      {$group: {_id: '$lesson', count: {$sum: 1}}}]),
    Lesson.find(lesson, param).sort({number: 1}),
    Lesson.count({enabled: true})
  ]).spread(function(userStories, lessons, max_steps) {
    // Grab passed and new lessons into one array of objects with PASSED property
    // Understand this piece of code!
    var passed;
    var lsn_data = lessons.map(function(lsn) {
      for (let i = 0; i < userStories.length; i++) {
        if (lsn.name === userStories[i]._id) {
          passed = userStories[i].count;
          break;
        } else { passed = 0;}
      }
      
      return {
        state_uk: lsn.state_uk,
        subj: lsn.subj,
        name: lsn.name,
        chapter: lsn.chapter,
        passed: passed
      };
    });
      
//    console.log(lsn_data);
    
    res.render('dashboard', {      
      min_val: 0,
      max_val: 100,     
      progress: 40,      
      passed: 5,
      curr_chapter: 'vars', // TODO change according to the last passed story chapter
      state: strings[state],
      lang: state,
      chapters: chapters,
      lesson_data: lsn_data,
      max_steps: max_steps 
    });
  });
};

