const Monster = require('../models/Monster');
const Step = require('../models/Step');
const Story = require('../models/Story');
const UserStory = require('../models/UserStory');
const genFunc = require('./gen_functions');
const Promise = require('bluebird');

var lang = 'uk';//TODO lang support
var state = 'state_' + lang; 
var items = 'items_' + lang;

exports.getHeroes = (req, res, next) => {
  var query = {};
 
  //TODO add query or remove Promise.all
  // Select necessary fields only
  Promise.all([
    Monster.find(query)
  ]).spread(function(zoo) {
      res.render('13_stories/select_heroes', {
        title: 'Вибери монстра',
        monsters_zoo: zoo,
        cur_story: req.session.story_name,
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
    story_title: 'Ти і ліфт-монстр',
    expl_items: [
      'Ліфт-монстр підіймається і робить це нескінченно. Ця історія — приклад циклу без умови завершення. Вийти з нього самотужки неможливо. Зупинити такий цикл можна тільки зовні.'
    ],
    subject: 'Вивчаємо цикли',
    edit: 'Редагувати',
    print: 'Друкувати',
    pdf: 'Згенерувати .pdf файл',
    dload: 'Завантажити',
    complete: 'Зберегти',
    you_can: 'Ти можеш',
    next_path: genFunc.getNextPath('arrange'), // TODO get story.type from DB
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