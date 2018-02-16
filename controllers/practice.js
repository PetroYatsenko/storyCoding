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
      title: 'Вибери монстра',
      msg_prem: 'Доступний у преміум акаунті.',
      msg_adv_prem: 'Доступний у просунутому та преміум акаунтах.',
      msg_next: 'Доступний в наступних історіях',
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
  req.sanitize('mr');
  //TODO figure out sanitization  
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
    Step.findOne(queryStep),
    Story.findOne(queryStory),
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
      title: story[state].title + monster[state].name,
      you_can: story[state].you_can,
      img1: story[state].img1,
      story_items: story[items],
      h1_act: story[state].h1,
      h2_act: story[state].h2,
      h3_act: story[state].h3,
      h4_act: story[state].h4,
      img2: story[state].img2,      
      img2_t: story[state].img2_t,
      smb_can: story[state].smb_can,
      steps: JSON.stringify(steps.steps).replace(/<\//g, "<\\/"),
      write_here: story[state].write,
      next_path: genFunc.getNextPath(story.type),
      next_btn: JSON.stringify('h4'), //TODO Move to DB(?)
      task: story[state].task,
      subject: story[state].subject
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
    story_title: 'Ти і ',
    edit: 'Редагувати',
    print: 'Друкувати',
    pdf: 'Згенерувати .pdf файл',
    dload: 'Завантажити',
    complete: 'Зберегти',
    you_can: 'Ти можеш',
    author: 'Автор історії '
  };
          
  Lesson.findOne(query, param).then(function(lesson) {
    res.render('13_stories/arrange_story', {
      story_title: strings[state].story_title + lesson[state].name,
      subject: lesson[state].subname,
      watermark: JSON.stringify(res.locals.course_name + '\n' + lesson[state].subname),
      next_path: genFunc.getNextPath('dashboard'), // TODO get story.type from DB
      save_path: JSON.stringify('/practice/story_builder/save'), //TODO
      credentials: JSON.stringify(
        strings[state].author + req.user.profile.name.toUpperCase() + '\n' + 
        res.locals.siteTitle + ':' + res.locals.url
      ),
      strings: strings[state]
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