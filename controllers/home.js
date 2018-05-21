const Monster = require('../models/Monster');

exports.index = (req, res) => {
  var query = {enabled: true};
  var q_param = {enabled: 0, _id: 0};
  var state = 'state_' + res.locals.lang; 
  
  Monster.find(query, q_param).then(function(monsters) {
    res.render('home', {
      title: 'Home', // TODO
      state: state,
      monsters: monsters
    });
  });
};

exports.userAgreement = (req, res, next) => {
  res.render('user_agreement', {
    // TODO add parameters (links, addresses, names so on)
  }); 
};

exports.paymentPage = (req, res, next) => {
  req.sanitize('sum');
  var lang = res.locals.lang;
  var sender = req.user.profile.name || req.user.email;
  var str = {
    uk: {
      title: 'Дані для оплати',
      intro_mess: 'Зазначте в коментарі до платежу на карту "Приватбанку" ваші <span class="text-uppercase">телефон</span> та <span class="text-uppercase">логін</span>',
      activation_mess: 'Після отримання оплати ваш профіль буде активовано впродовж двох годин.',
      sender: sender,
      card_num: '4149 6293 1036 3361',
      accepter: 'Яценко Петро Олександрович',
      login_field: 'Ваш логін/повне імʼя',
      card_field: 'Номер карти Приватбанку',
      name_field: 'Імʼя отримувача',
      sum_field: 'Cума',
      sum: res.locals.prices.basic
    } 
  };
  res.render('payments', {
    str: str[lang],
  });
};