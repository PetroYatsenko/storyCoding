const Monster = require('../models/Monster');
const Lesson = require('../models/Lesson');
const Step = require('../models/Step');
const Story = require('../models/Story');
const UserStory = require('../models/UserStory');
const genFunc = require('./gen_functions');
const Promise = require('bluebird');

exports.getMonstersCollection = (req, res, next) => {
  var sn = req.session.story_name;
  const user_account = req.user.classes[res.locals.course_id].account;
  
  Promise.all([
    Lesson.findOne({name: sn, enabled: true}, {monsters: 1, _id: 0}),
    Monster.find({}, {_id: 0})
  ]).spread(function(avail, zoo) {    
    var state = 'state_' + res.locals.lang;
    var strings = {};
    // TODO: messages table + lang support 
    strings[state] = {
      title: 'Доступні монстри',
      msg_prem: 'Живе у преміум акаунті.',
      msg_adv_prem: 'Живе у просунутому та преміум акаунтах.',
      msg_next: 'Живе в наступних історіях',
      msg_storage: 'Здається, ваш браузер не підтримує веб-сесії. Будь ласка, встановіть найновішу версію',
    };
    
    var status = 'next';
    var actor = {};
    var chosen = avail.monsters[user_account];
    
    var podium = zoo.map(function(mr) {
      if (chosen.indexOf(mr.monster) === -1) {
        switch(user_account) {
          case 'premium':
            status = 'next';
            break;
          case 'advanced':
            if (avail.monsters.premium.indexOf(mr.monster) > 0) {
              status = 'prem';
              break;
            } else { 
              status = 'next'; 
              break;
            }
          case 'basic':
            if (avail.monsters.advanced.indexOf(mr.monster) > 0) {
              status = 'adv_prem';
              break;
            } else if (avail.monsters.premium.indexOf(mr.monster) > 0) {
              status = 'prem';
              break;
            } else {
              status = 'next';
              break;
            }
          default:
            status = 'next';
        }
      } else {
        status = 'enabled';
      }
      
      actor = {
        monster: mr.monster,
        status: status,
        name: mr[state].name,
        talent: mr[state].talent
      };
            
      return actor;
    });
    
    res.render('13_stories/select_heroes', {
      strings: strings[state],
      podium: podium,
      next_step: genFunc.getNextPath('heroes'),
      no_storage: JSON.stringify(strings[state].msg_storage)
    });
  });
};

exports.getStoryBuilder = (req, res, next) => {
  //TODO figure out sanitization  
  req.sanitize('mr');
  var mr = req.query.mr;
  var state = 'state_' + res.locals.lang; 
  var items = 'items_' + res.locals.lang;
  var queryStory = {
    story: req.session.story_name,
    hero: mr, 
    type: 'practice',
  };
  // For now queryStep is equal to queryStory
  var queryStep = {
    story: req.session.story_name,
    hero: mr, 
    type: 'practice', 
  };
  
  var replace = { //TODO same values -- move to general functions
    bt1: '<button type="button" class="btn btn-success btn-sm" id="h1">',
    bt2: '<button type="button" class="btn btn-success btn-sm" id="h2">',
    bt3: '<button type="button" class="btn btn-success btn-sm" id="h3">',
    bt4: '<button type="button" class="btn btn-success btn-sm" id="h4">',
    bte: '</button>'  
  };
    
  Promise.all([
    Step.findOne(queryStep),
    Story.findOne(queryStory),
    Monster.findOne({monster: mr})
  ]).spread(function(steps, story, monster) {
    // Replace placeholders
    for (let i = 0; i < story[items].length; i++) {
      story[items][i] = genFunc.replacePlaceholders(replace, story[items][i]);
    }    
    res.render('13_stories/story_builder', {
      str: story[state],
      title: story[state].title + monster[state].name,
      story_items: story[items],
      steps: JSON.stringify(steps.steps).replace(/<\//g, "<\\/"),
      next_path: genFunc.getNextPath(story.type),
      next_btn: 'next',
    });
  });
};

exports.arrangeStory = (req, res, next) => {  
  var state = 'state_' + res.locals.lang;
  var query = {name: req.session.story_name, enabled: true};  
  var param = {_id: 0};
  param[state] = 1;
  // TODO -- to the lang table
  var strings = {};
  strings[state] = {
    title: 'Майже готово',
    edit: 'Редагувати',
    print: 'Друкувати',
    pdf: 'Згенерувати .pdf файл',
    dload: 'Завантажити',
    complete: 'Зберегти',
    author: 'Автор історії ',
    message: 'Тепер ти можеш відредагувати свою історію, зберегти або роздрукувати'
  };
  // Add info message
  req.flash('info', { msg: strings[state].message });
  
  Lesson.findOne(query, param).then(function(lesson) {
    res.render('13_stories/arrange_story', {
      story_title: lesson[state].name,
      subject: lesson[state].subname,
      watermark: JSON.stringify(res.locals.course_name + '\n' + lesson[state].subname),
      next_path: genFunc.getNextPath('dashboard'), // TODO get story.type from DB
      save_path: JSON.stringify('/practice/story_builder/save'), //TODO
      credentials: JSON.stringify(
        strings[state].author + req.user.profile.name.toUpperCase() + '\n' + 
        res.locals.siteTitle + ':' + res.locals.url
      ),
      str: strings[state]
    });
  });
};

exports.saveStory = (req, res, next) => {
  req.sanitize('story');
  // TODO lang support
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