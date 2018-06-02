const Monster = require('../models/Monster');
const Lesson = require('../models/Lesson');
const Step = require('../models/Step');
const Story = require('../models/Story');
const Test = require('../models/Test');
const UserStory = require('../models/UserStory');
const genFunc = require('./gen_functions');
const Promise = require('bluebird');
const UserDiploma = require('../models/UserDiploma');

exports.getMonstersCollection = (req, res, next) => {  
  req.sanitize('story');
  var story_name = req.params.story;
  const user_account = req.user.classes[res.locals.course_id].account;
  
  Promise.all([
    Lesson.findOne({name: story_name, enabled: true}, {monsters: 1, _id: 0}),
    Monster.find({}, {_id: 0})
  ]).spread(function(avail, zoo) {
    if (avail === null || zoo === null) {
      return next();
    }
    var state = 'state_' + res.locals.lang;
    var strings = {};
    
    strings.state_uk = {
      title: 'Доступні герої',
      msg_prem: 'Невдовзі оселиться в профілі "Родина".',
      msg_adv_prem: `Невдовзі оселиться \n в "Гуртку" та "Родині".`,
      msg_next: 'Живе в наступних історіях', // TODO -- never used
      msg_storage: 'Здається, ваш браузер не підтримує веб-сесії. Будь ласка, встановіть найновішу версію',
    };
    
    var status = 'next';
    var actor = {};
    var chosen = avail.monsters[user_account];
    // TODO figure out do we need "next" status at all when no showing all monsters
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
          case 'sandbox':  
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
      next_step: genFunc.getNextPath('heroes', story_name),
      no_storage: JSON.stringify(strings[state].msg_storage)
    });
  });
};

exports.getStoryBuilder = (req, res, next) => {
  //TODO figure out sanitization  
  req.sanitize('mr');
  req.sanitize('story');
  var story_name = req.params.story;
  var hero = req.params.hero; 
  var state = 'state_' + res.locals.lang; 
  var items = 'items_' + res.locals.lang;  
  var queryStory = {
    story: story_name,
    hero: hero, 
    type: 'practice',
  };
  // For now queryStep is equal to queryStory
  var queryStep = {
    story: story_name,
    hero: hero, 
    type: 'practice', 
  };
 
  var replace = genFunc.replaceButtonObj;
    
  Promise.all([
    Step.findOne(queryStep),
    Story.findOne(queryStory),
    Monster.findOne({monster: hero})
  ]).spread(function(steps, story, monster) {
    if (steps === null || story === null || monster === null) {
      return next();
    }
    // Replace placeholders
    for (let i = 0; i < story[items].length; i++) {
      story[items][i] = genFunc.replacePlaceholders(replace, story[items][i]);
    } 
    // Add help message 
    req.flash('info', {msg: story[state].hint});
    var story_title = monster[state].name + story[state].title;
    
    res.render('13_stories/story_builder', {
      str: story[state],
      title: story_title,
      story_items: story[items],
      steps: JSON.stringify(steps.steps).replace(/<\//g, "<\\/"),
      next_path: genFunc.getNextPath(story.type, story_name, hero, story_title),
      next_btn: 'next',
      min_length: 25,
    });
  });
};

exports.arrangeStory = (req, res, next) => {
  req.sanitize('story');
  req.sanitize('hero');
  req.sanitize('title');
  var story_name = req.params.story;
  var hero = req.params.hero;
  var state = 'state_' + res.locals.lang;
  var query = {name: story_name, enabled: true};  
  var param = {
    chapter: 1, 
    subj: 1, 
    name: 1, 
    _id: 0
  };
  param[state] = 1;
  var strings = {};
  
  strings.state_uk = {
    edit: 'Редагувати',
    print: 'Друкувати',
    pdf: 'Згенерувати .pdf файл',
    dload: 'Завантажити',
    complete: 'Зберегти',
    author: 'Автор історії ',
    hint: 'Майже готово! Тепер ти можеш відредагувати свою історію, зберегти або роздрукувати',
    popup_hint: 'Зверни увагу: коли натискаєш кнопки "Згенерувати .pdf файл" або \n\
      "Друкувати", веб-переглядач може блокувати спливаючі вікна (pop-ups). \n\
      Аби цього уникнути, слід натиснути на повідомленні переглядача та дозволити спливаючі вікна.',
    add_name: "Хочеш побачити замість мейла своє ім'я як автора? Клікни по аватарці, \n\
      зайди у \"Мій профіль\", напиши ім'я та натисни \"Зберегти\". \n\
      Повернися назад і не забудь оновити сторінку з історією.",
    save: 'Зберегти зміни',
    record: 'Записати'
  };
  // Add info message
  req.flash('info', {msg: strings[state].hint});
  req.flash('errors', {msg: strings[state].popup_hint});
    
  if (typeof req.user.profile.name === 'undefined' || req.user.profile.name === '') {
    req.flash('success', {msg: strings[state].add_name});
  }
  
  var author_name = req.user.profile.name || req.user.email;
    
  Lesson.findOne(query, param).then(function(lsn) {
    // Check for errors
    if (lsn === null) {
      return next();
    }
    var prefix = '/images/practice'; // folder + type. TODO - get from 
    var image = hero + '_' + lsn.subj + '.png';
    
    res.render('13_stories/arrange_story', {
      story_title: req.params.title,
      subject: lsn[state].subname, // TODO -- use or not?
      watermark: JSON.stringify(
        lsn[state].subname + '\n' + res.locals.course_name + '\n' +  
        res.locals.siteTitle + ': ' + res.locals.url
      ),
      next_path: genFunc.getNextPath('dashboard'),
      story_hero: JSON.stringify(hero),
      story_name: JSON.stringify(story_name),
      save_path: JSON.stringify('/practice/story_builder/save'),
      author: JSON.stringify(
        strings[state].author + author_name.toUpperCase()
      ),
      str: strings[state],
      img_path: genFunc.makeImgPath(prefix, lsn.chapter, lsn.name, image),
      next_btn: 'send' 
    });
  });
};

exports.test = (req, res, next) => {
  req.sanitize('test'); //TODO
  var test_name = req.params.test;
  var state = 'state_' + res.locals.lang;  
  var queryTest = {
    name: test_name
  };  
  var param = {};
  param[state] = 1;
  
  var str = {
    state_uk : {
      title: 'Тест без стресу'
    }
  };
  var d = {};
  
  Test.find(queryTest, param).then(function(data) {
    if (typeof data === 'undefined' || data.length === 0) {
      return next();
    }
    data.forEach(function(data) {
      data[state].test.forEach(function(t, index) {
        var new_id = genFunc.hashGen(data._id + index); //TODO
        d[new_id] = {
          q: t['quest'],
          a: Buffer.from(t['answ']).toString('base64'),
          v: t['variants'],
          s: data[state].subtitle
        };
      });
    });
    res.render('13_stories/test', {
      next_path: genFunc.getNextPath('test'),
      save_path: JSON.stringify('/practice/tests/save'),
      str: str,
      d: d,
      state: state,
      test_name: JSON.stringify(test_name),
      split_symbol: JSON.stringify('@'),
      next_btn: 'next'
    });
  }); 
  // TODO catch possible errors like
  // .catch(function(err) {
  //  if (err) return next(err);
  // }); -- figure it out
};

exports.diploma = (req, res, next) => {  
  var queryStep, queryStory;
  var state = 'state_' + res.locals.lang;
  var items = 'items_' + res.locals.lang;
  
  queryStep = queryStory = {
    story: 'diploma_story',
    type: 'diploma',
  };
  
  Promise.all([
    Step.findOne(queryStep),
    Story.findOne(queryStory)
  ]).spread(function(steps, story) {
    if (steps === null || story === null) {
      return next();
    }
    // Replace placeholders
    for (let i = 0; i < story[items].length; i++) {
      story[items][i] = genFunc.replacePlaceholders(genFunc.replaceButtonObj, story[items][i]);
    } 
    // Add help message 
    req.flash('info', {msg: story[state].hint});
  
    res.render('13_stories/diploma_story', {
      str: story[state],
      title: story[state].title,
      story_items: story[items],
      steps: JSON.stringify(steps.steps).replace(/<\//g, "<\\/"),
      next_path: genFunc.getNextPath(story.type),
      next_btn: 'next',
      min_length: 5, // less than for practice -- to handle the story name      
      story_type: 'diploma'// TODO
    });
  });
};

exports.arrangeDiploma = (req, res, next) => {
  var state = 'state_' + res.locals.lang;
  var strings = {};
  var prefix = '/images';
  var folder = 'diploma';
  var image = 'se_' + genFunc.getRandomInt(1, 2) + '.png';
  
  strings.state_uk = {
    img1_t: 'Таємний Редактор чекає',
    edit: 'Редагувати',
    dload: 'Завантажити .pdf файл',
    send: 'Надіслати',
    save: 'Зберегти зміни',
    author: 'Автор ',
    diploma: 'Дипломна історія',
    add_name: "Хочеш побачити замість мейла своє ім'я як автора? \n\
      Клікни по аватарці, зайди у \"Мій профіль\" та впиши його. \n\
      І не забудь оновити сторінку",
    hint: 'Тобі залишилося тільки відредагувати свою історію: ' +
      'прочитати на свіже око і виправити помилки, а, можливо, щось переписати. ' + 
      'Тоді сміливо натискай кнопку “Надіслати", щоби відправити історію Таємному Редактору. ' + 
      'Він прочитає і дасть поради, як можна покращити твою історію. ' + 
      'А тоді вишле тобі іменний диплом, на який ти заслуговуєш!'
  };
  
  // Add info message
  req.flash('info', {msg: strings[state].hint});
  if (typeof req.user.profile.name === 'undefined'  || req.user.profile.name === '') {
    req.flash('success', {msg: strings[state].add_name});
  };
  var author_name = req.user.profile.name.toUpperCase() || req.user.email;
  
  res.render('13_stories/arrange_diploma', {
    watermark: JSON.stringify(
      strings[state].diploma + '\n' + res.locals.course_name + '\n' + 
      res.locals.siteTitle + ': ' + res.locals.url
    ),
    next_path: genFunc.getNextPath('dashboard'),
    save_path: JSON.stringify('/practice/story_builder/diploma/save'),
    next_btn: 'send',
    author: JSON.stringify(
      strings[state].author + author_name.toUpperCase()
    ),
    str: strings[state],
    img_path: genFunc.makeImgPath(prefix, folder, 'secret_editors', image),
    img_pdf: genFunc.makeImgPath(prefix, folder, 'story', 'sign.png')
  });
};

exports.saveDiploma = (req, res, next) => {
  req.sanitize('story');
  req.sanitize('title');
  var strings = {};
  var state = 'state_' + res.locals.lang;
  
  strings.state_uk = {
    hint: 'Твою дипломну історію успішно поставлено в чергу до Секретного ' + 
      'Редактора. Зазвичай він відповідає впродовж 24 годин. Тримаємо кулачки!',
    dipl_exists: 'Твою дипломну історію вже надіслано Таємному Редакторові.'
  };
  
  var query = {
    userId: req.user.id
  };
  
  const diploma = new UserDiploma({
    d_title: req.body.title,
    d_story: req.body.story,
    userId: req.user.id
  });

  UserDiploma.findOne(query, (err, existingDiploma) => {    
    if (err) {
      console.error(err);
      return res.status(500).send({error: 'Internal Server Error'});
    }  
    if (existingDiploma) {
      req.flash('errors', { msg: strings[state].dipl_exists });
      res.format({
        json: function(){
          res.send({status: 'OK'});
        }
      });
    } else {
      diploma.save((err) => {
        if (err) {
          console.error(err);
          return res.status(500).send({error: 'Internal Server Error'});
        }  
        req.flash('success', {msg: strings[state].hint});
        res.format({
          json: function(){
            res.send({status: 'OK'});
          }
        });
      });
    };
  });
};

exports.saveTest = (req, res, next) => {
  req.sanitize('score');
  req.sanitize('test_name');
  // TODO lang support
  var hint = 'Вітаємо! Ти переходиш до нового розділу!';
  var query = {
    lesson: req.body.test_name,
    userId: req.user.id
  };
  var params = {
    story_txt: req.body.score
  };  
  
  UserStory.findOneAndUpdate(query, params, {upsert: true}, 
    function(err, doc) {
      if (err) {
        console.error(err);
        return res.status(500).send({error: 'Internal Server Error'});
      }  
      req.flash('success', {msg: hint});
      res.format({
        json: function(){
          res.send({status: 'OK'});
        }
      });
    }
  );
};

exports.saveStory = (req, res, next) => {
  req.sanitize('story_name');
  req.sanitize('story');
  req.sanitize('hero');
  req.sanitize('title');
  var lang = res.locals.lang;
  var str = {
    uk: {
      hint: 'Вітаємо! Твоя історія успішно записана.'
    }
  };
  var query = {
    hero: req.body.hero,
    lesson: req.body.story_name,
    userId: req.user.id
  };
  var params = {
    story_txt: req.body.story, 
    story_title: req.body.title,
    hero: req.body.hero
  };
  
  UserStory.findOneAndUpdate(
    query, 
    params, 
    {upsert: true}, 
    function(err, doc) {
      if (err) {
        console.error(err);
        return res.status(500).send({error: 'Internal Server Error'});
      }  
      req.flash('success', {msg: str[lang].hint});
      res.format({
        json: function(){
          res.send({status: 'OK'});
        }
      });
    }
  );
};