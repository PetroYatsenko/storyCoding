const Monster = require('../models/Monster');
const Step = require('../models/Step');
const Story = require('../models/Story');
const UserStory = require('../models/UserStory');
const Promise = require('bluebird');
var lang = 'uk'; //TODO language support

exports.getHeroes = (req, res, next) => {
  var query = {};
  var lesson = 'з циклом'; //TODO
  
  //TODO add query or remove Promise.all 
  Promise.all([
    Monster.find(query)
  ]).spread(function(zoo) {      
      res.render('13_stories/select_heroes', {
        title: 'Починаємо вигадувати історію ' + lesson, 
        description: 'Вибери монстра',
        monsters_zoo: zoo,
        nextStep: JSON.stringify('/practice/story_builder'),        
        // TODO: messages table + lang support
        noStorage: JSON.stringify('Sorry. Your browser has no web-session support. Please, install a newest browser version.')
      });
    });
};

// TODO move to general functions
exports.replacePlaceholders = function(val, str) {
  var replaced = "";
  var parts = str.split(/(\%\w+?\%)/g).map(function(v) {
    replaced = v.replace(/\%/g,"");
    return val[replaced] || replaced; 
  });

  return parts.join("");
};

exports.getLoopBuilder = (req, res, next) => {
  req.sanitize('mr'); //TODO figure out sanitization  
  var mr = req.query.mr;
  var query = {story: mr, type: 'practice'};  
  var trials = 'чотирьох кроків'; //TODO  
  var state = 'state_' + lang; 
  var items = 'items_' + lang;
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
    

    for (let i = 0; i < story[items].length; i++) {
      story[items][i] = exports.replacePlaceholders(replace, story[items][i]);
    } 
    
    for (let i = 0; i < story[state].task.length; i++) {
      story[state].task[i] = exports.replacePlaceholders(replace, story[state].task[i]);
    }
    
    res.render('13_stories/story_builder', {
      title: story[state].title + monster.name_uk,
      you_can: story[state].you_can, //TODO take from db + lang support
      monster_img: monster.monster + '_large',
      story_items: story[items],      
      go_ahead: story[state].go_ahead,
      stop: story[state].stop,
      help: story[state].help,
      look_around: story[state].look,
      step_loop: story[state].loop,
      smb_can: story[state].smb_can,
      steps: JSON.stringify(steps.steps).replace(/<\//g, "<\\/"),
      write_here: story[state].write,
      counter: story[state].counter,
      next_path: JSON.stringify(steps.next_path),
      task: story[state].task,
      subject: story[state].subject
    });
  });
};

exports.arrangeStory = (req, res, next) => {
  var state = 'state_' + lang; 
  var items = 'items_' + lang;
  
  res.render('13_stories/arrange_story', {
    title: 'Майже готово',
    story_title: 'Ти і ліфт-монстр',
    expl_items: [
      'Ліфт-монстр підіймається і робить це нескінченно.',
      'Ця історія -- приклад циклу без умови завершення. Вийти з нього самотужки неможливо.',
      'Зупинити такий цикл можна тільки зовні.'
    ],
    subject: 'Вивчаємо цикли',
    edit: 'Редагувати',
    print: 'Друкувати',
    pdf: 'Згенерувати .pdf файл',
    dload: 'Завантажити',
    complete: 'Зберегти',
    you_can: 'Ти можеш',
    next_path: JSON.stringify('/lessons/dashboard'),
    save_path: JSON.stringify('/practice/story_builder/save'),
  });
};

exports.saveStory = (req, res, next) => {
  req.sanitize('story');
  //var message = 'msgs_' + lang; // TODO lang support
  var message = 'Вітаємо! Твоя історія успішно записана!';
  var query = {
    hero: req.body.mr,
    userId: req.user.id
  };
  
  UserStory.findOneAndUpdate(
    query, 
    {story: req.body.story, $inc: {trials: +1}}, 
    {upsert:true}, 
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