const Monster = require('../models/Monster');

exports.index = (req, res) => {
  var query = {enabled: true};
  var q_param = {enabled: 0, _id: 0};
  var state = 'state_' + res.locals.lang; 
  
  Monster.find(query, q_param).sort({number: 1}).then(function(monsters) {
    res.render('home', {
      main_page: true,
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
  req.sanitize('acc_type');
  var lang = res.locals.lang;
  var sender = req.user.profile.name || req.user.email;
  var str = {
    uk: {
      title: 'Дані для оплати',
      intro_mess: 'Після переходу на безпечну сторінку оплати обовʼязково напишіть \n\
        у полі "Призначення" ваші <span class="text-uppercase">телефон</span>, \n\
        <span class="text-uppercase">логін</span> та <span class="text-uppercase">повне імʼя</span>',
      discount_mess: 'Якщо маєте промокод на знижку, також зазначте його в полі "Призначення"',
      activation_mess: 'Після отримання оплати ваш профіль буде активовано впродовж двох годин.',
      sender: sender,
      payment_page: 'Сторінка оплати',
      login_field: 'Ваш логін/повне імʼя',
      sum_field: 'Cума/профіль',
      payment_page_url: 'https://www.liqpay.ua/uk/checkout/card/greatprose',
      sum: req.params.sum || 'undefined',
      acc: req.params.acc_type || 'undefined'
    } 
  };
  res.render('payments', {
    str: str[lang],
  });
};