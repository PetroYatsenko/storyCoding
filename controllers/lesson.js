const Monster = require('../models/Monster');
const Story = require('../models/Story');
const UserStory = require('../models/UserStory');
const UserDiploma = require('../models/UserDiploma');
const Steps = require('../models/Step');
const Lesson = require('../models/Lesson');
const genFunc = require('./gen_functions');
const Promise = require('bluebird');


exports.tutorial = (req, res, next) => {
  req.sanitize('chapter');
  var chpt = req.params.chapter;
  var strings = {};
  var state = 'state_' + res.locals.lang;
  
  strings.state_uk = {
    title_dashboard: 'Як працює список занять',
    title_story: 'Як читати страшну історію',
    title_practice: 'Як конструювати свою історію',
    title_tests: 'Як працюють тести',
    title_diploma: 'Як отримати диплом',
    go_back: 'До історій',
    next_tutorial: 'Наступне відео',
    next_to: {
      dashboard: 'story',
      story: 'practice',
      practice: 'tests',
      tests: 'diploma',
      diploma: 'dashboard'
    }
  };
  
  res.render('13_stories/tutorial', {
    chapter: chpt, 
    str: strings[state]
  });  
}; 

exports.lesson = (req, res, next) => {
  req.sanitize('story');
  req.sanitize('subj'); //TODO we are not using it further;
  var lang = res.locals.lang;
  var state = 'state_' + lang; 
  var items = 'items_' + lang;
  var story_name = req.params.story; 
   
  var query = {
    story: story_name, 
    type: 'lesson'
  };
  
  var alert = {
    uk: {
      ws_err: 'Виглядає на те, що ваш веб-переглядач не підтримує веб-сховище (Web Storage). Будь ласка, встановіть найновішу версію  веб-переглядача.'
    },
    en: {
      ws_err: 'Looks like your browser has no Web Storage support. Please, use a newest browser version.'
    }
  };
  
  var replace = genFunc.replaceButtonObj;
     
  Promise.all([
    Steps.findOne(query),
    Story.findOne(query)
  ]).spread(function(steps, story) {
    if (steps === null || story === null) {
      return next();
    }
    for (let i = 0; i < story[items].length; i++) {
      story[items][i] = genFunc.replacePlaceholders(replace, story[items][i]);
    }
    
    res.render('13_stories/lesson', {
      alert: alert[lang].ws_err,
      strings: story[state],
      story_items: story[items],     
      steps: JSON.stringify(steps.steps).replace(/<\//g, "<\\/"),
      next_path: genFunc.getNextPath(story.type, story_name),
      next_btn: 'next' //TODO genFunc.getNextPath(story.type)
    });
  }).catch(function(err) {
    if (err) return next(err);
  });
};

exports.explanation = (req, res, next) => {
  req.sanitize('story'); //TODO figure out
  var state = 'state_' + res.locals.lang; 
  var items = 'items_' + res.locals.lang;
  var story_name = req.params.story;
  var query = {
    story: story_name, 
    type: 'explanation'
  };
  
  Story.findOne(query).then(function(d) {
    if (d === null) {
      return next();
    }
    res.render('13_stories/explanation', {
      img: d.img,
      str: d[state],
      expl_items: d[items],
      next_path: genFunc.getNextPath(d.type, story_name),
      next_btn: 'next'
    });  
  });
};

exports.dashboard = (req, res, next) => {
  var state = 'state_' + res.locals.lang;
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
      dash_title: 'Пишемо з монстрами',
      test: 'Закріпляємо навички',
      demo: 'Як це працює?',
      vars: 'Змінні',
      cond: 'Умови',
      loop: 'Цикли',
      func: 'Функції',
      trials: 'Монстри',
      tooltip: {
        trials: 'Кількість монстрів та героїв, з якими ти вже написав свої історії.',
        diploma_story: 'Дипломна історія містить змінні, функції, цикл та умову.',
        continue: 'Продовжуй!',
        read_practice_story: 'Прочитати попередню',
        read_expl: 'Як зроблена ця історія?',
        read_story: 'Пройти історію'
      },
      diploma: 'Отримай диплом',
      start: 'Починай!',
      next: '>>',
      diploma_story_disabled: 'Спочатку пройди всі страшні історії.',
      get_diploma: 'Напиши фінальну історію та отримай диплом.',
      dipl_exists: 'Твою дипломну історію вже надіслано Таємному Редакторові.',
      diploma_story: 'Дипломна історія',
    }
  };
  // TODO -- wether move it somewhere?
  var chapters = ['demo', 'vars', 'cond', 'loop', 'func'];
  
  Promise.all([
    UserStory.aggregate([
      {$match: {userId: req.user.id}}, 
      {$group: {_id: '$lesson', count: {$sum: 1}}}]),
    Lesson.find(lesson, param).sort({number: 1}),
    Lesson.count({enabled: true, chapter: {$ne: 'demo'}}),
    UserDiploma.findOne({userId: req.user.id})
  ]).spread(function(userStories, lessons, max_steps, diploma) {
    // Grab passed and new lessons into one array of objects
    // TODO: understand this piece of code :)
    var user_stories = 0;
    var lsn_data = lessons.map(function(lsn, index) {
      for (let i = 0; i < userStories.length; i++) {
        if (lsn.name === userStories[i]._id) {
          user_stories = userStories[i].count;
          break;
        } else { user_stories = 0;}
      }
      
      return {
        state_uk: lsn.state_uk,
        subj: lsn.subj,
        name: lsn.name,
        chapter: lsn.chapter,
        user_stories: user_stories
      };
    });
    
    // Calculate the passed steps procentage 
    // (takes into account the knowledge checks too)
    var passed = userStories.length;
    
    // Get current step's chapter
    // Completely the same I`m using in the dashboard.pug
    // TODO: find out the better way to know a current chapter
    var curr_chapter;
    var enable_new = false;
    var counter = 0;
    
    chapters.forEach(function(chapter) {
      lsn_data.forEach(function(story) {
        if (chapter === story.chapter) {
          if (story.user_stories > 0 || story.name === 'demo' || enable_new ) {
            curr_chapter = chapter;
            if (story.name !== 'demo') {
              counter++;
            }
            enable_new = counter === passed ? true : false;
          }
        }
      });
    });
    
    res.render('dashboard', {      
      min_val: 0,
      max_val: max_steps,     
      progress: Math.round(passed * 100 /  max_steps),      
      passed: passed,
      curr_chapter: curr_chapter,
      state: strings[state],
      lang: state,
      chapters: chapters,
      lesson_data: lsn_data,
      diploma: diploma ? true : false,
      user_acc: req.user.classes[res.locals.course_id].account
    });
  }).catch(function(err) {
    if (err) return next(err);
   });
};

exports.readStory = (req, res, next) => {
  req.sanitize('story');
  var lang = res.locals.lang;
  var state = 'state_' + lang;  
  var story_name = req.params.story;
  
  var query_story = {
    lesson: story_name,
    userId: req.user.id
  };
  
  var param_story = {
    _id: 0
  };
  
  var query_lsn = {
    name: story_name 
  };
  
  var param_lsn = {
    chapter: 1, 
    subj: 1, 
    name: 1,
    _id: 0
  };
  param_lsn[state] = 1;  
  
  var str = {
    uk: {
      edit: 'Редагувати',
      print: 'Друкувати',
      pdf: 'Згенерувати .pdf файл',
      dload: 'Завантажити',
      complete: 'Зберегти',
      author: 'Автор історії ',
      hint: 'Ти можеш відредагувати свою історію, завантажити або роздрукувати.',
      hint_edit: 'Май на увазі, що після того, як ти збережеш нову редакцію, вона перепише стару історію.',
      save: 'Зберегти зміни',
      record: 'Записати'
    }
  };
  
  var author_name = req.user.profile.name || req.user.email;
  var prefix = '/images/practice';
  
  // Add info message
  req.flash('info', {msg: str[lang].hint});
  //req.flash('errors', {msg: str[lang].hint_edit});
  
  Promise.all([
    Lesson.findOne(query_lsn, param_lsn),
    UserStory.findOne(query_story, param_story).sort({$natural:-1})
  ]).spread(function(lsn, story) {
    if (lsn === null || story === null) return next(); //Check for vulnerabilities
    
    var image = story.hero + '_' + lsn.subj + '.png';
    
    res.render('13_stories/read_story', {
      story_title: story.story_title,
      watermark: JSON.stringify(
        lsn[state].subname + '\n' + res.locals.course_name + '\n' +  
        res.locals.siteTitle + ': ' + res.locals.url
      ),
      next_path: genFunc.getNextPath('dashboard'),
      story_hero: JSON.stringify(story.hero),
      story_name: JSON.stringify(story.lesson),
      save_path: JSON.stringify('/practice/story_builder/save'),
      author: JSON.stringify(
        str[lang].author + author_name.toUpperCase()
      ),
      str: str[lang],
      img_path: genFunc.makeImgPath(prefix, lsn.chapter, story.lesson, image),
      next_btn: 'send',
      story_text: JSON.stringify(story.story_txt)
    });
  }); 
};

exports.readDiploma = (req, res, next) => {
  
};
