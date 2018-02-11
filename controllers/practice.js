const Monster = require('../models/Monster');
const Lesson = require('../models/Lesson');
const Step = require('../models/Step');
const Story = require('../models/Story');
const UserStory = require('../models/UserStory');
const genFunc = require('./gen_functions');
const Promise = require('bluebird');

exports.getMonstersCollection = (req, res, next) => {
  var qm = {_id: 0};  //TODO select just a nesessary info  
  var sn = req.session.story_name;
  //TODO check for account type (basic, advanced, premium)
  // and grab available monsters only
  //  switch req.session.acc_type
  //  case basic
  //  case advanced
  //  case premium
  var available = {practice: 1, _id: 0};
  
  Promise.all([
    Lesson.findOne({name: sn}, available),
    Monster.find({}, qm)
  ]).spread(function(awake, zoo) {
    // Mark monsters unavailable for this practice
    for (let key in zoo) {
      if (zoo.hasOwnProperty(key) && zoo[key].enabled) {
        if (awake.practice.indexOf(zoo[key].monster) === -1) {
          zoo[key].enabled = false;
        }
      }  
    }
    
    res.render('13_stories/select_heroes', {
      title: 'Вибери монстра',
      zoo: zoo,
      state: 'state_' + res.locals.lang,
      msg: 'Доступний у преміум акаунті.', //TODO - get from messages table + lang support + Доступний в наступних історіях.
      nextStep: genFunc.getNextPath('heroes'), // TODO - move story.type to DB        
      // TODO: messages table + lang support
      noStorage: JSON.stringify('Sorry. Your browser has no web-session support. Please, install a newest browser version.')
    });
  });
};

exports.getStoryBuilder = (req, res, next) => {
  req.sanitize('mr');
  //TODO figure out sanitization  
  var mr = req.query.mr;
  var state = 'state_' + res.locals.lang; 
  var items = 'items_' + res.locals.lang;
  var query = {
    story: mr, 
    type: 'practice',
    subject: req.session.subject
  };  
  
  var trials = 'чотирьох кроків'; //TODO 
  var replace = { //TODO get from a query from the separate db document
    trials: trials,
    user_type_1: 'один хлопчик', 
    user_type_2: 'він',
    user_name: 'Данило',
    end_1: 'oв',
    end_2: 'в',
    end_3: 'вся',
  };
    
  Promise.all([
    Step.findOne(query),
    Story.findOne(query),
    Monster.findOne({monster: mr})
  ]).spread(function(steps, story, monster) {
    // Replace placeholders
    for (let i = 0; i < story[items].length; i++) {
      story[items][i] = genFunc.replacePlaceholders(replace, story[items][i]);
    }
    for (let i = 0; i < story[state].task.length; i++) {
      story[state].task[i] = genFunc.replacePlaceholders(replace, story[state].task[i]);
    }    
    res.render('13_stories/story_builder', {
      title: story[state].title + monster.name_uk,
      you_can: story[state].you_can, //TODO take from db + lang support
      monster_img: monster.monster,
      story_items: story[items],
      h1_act: story[state].h1,
      h2_act: story[state].h2,
      h3_act: story[state].h3,
      h4_act: story[state].h4,
      img2: story[state].img2,
      smb_can: story[state].smb_can,
      steps: JSON.stringify(steps.steps).replace(/<\//g, "<\\/"),
      write_here: story[state].write,
      counter: story[state].counter,
      next_path: genFunc.getNextPath(story.type),
      next_btn: JSON.stringify('h4'), //TODO Move to DB(?)
      task: story[state].task,
      subject: story[state].subject
    });
  });
};

exports.arrangeStory = (req, res, next) => { 
  
  res.render('13_stories/arrange_story', {
    title: 'Майже готово',
    story_title: 'Ти і ' + req.session.story_name,
    subject: req.session.subject,
    
    edit: 'Редагувати',
    print: 'Друкувати',
    pdf: 'Згенерувати .pdf файл',
    dload: 'Завантажити',
    complete: 'Зберегти',
    you_can: 'Ти можеш',
    next_path: genFunc.getNextPath('arrange'), // TODO get story.type from DB
    save_path: JSON.stringify('/practice/story_builder/save'), //TODO
  });
};

exports.saveStory = (req, res, next) => {
  req.sanitize('story');
  //var message = 'msgs_' + lang; // TODO lang support
  var message = 'Вітаємо! Твоя історія успішно записана!';
  var query = {
    lesson: req.session.story_name,
    hero: req.body.mr,
    userId: req.user.id
  };
  
  UserStory.findOneAndUpdate(
    query, 
    {story_txt: req.body.story}, 
    {upsert: true}, 
    function(err, doc) {
      if (err) return res.send(500, { error: err });
      req.flash('success', { msg: message });
      res.format({
        json: function(){
          res.send({status: 'OK'});
        }
      });
    }
  );
};