const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

/**
 * GET /contact
 * Contact form page.
 */
exports.getContact = (req, res) => {
  
  res.render('contact', {
    title: 'Contact'
  });
};

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 */
exports.postContact = (req, res) => {
  var lang = res.locals.lang;
  var str = {
    uk: {
      name: 'Будь ласка, напишіть імʼя',
      email: 'Поштова адреса не чинна',
      message: 'Введіть повідомлення',
      subject: 'Зворотний звʼязок | ЧудоваПроза',
      success: 'Ваше повідомлення успішно надіслане! Якщо воно потребує відповіді, ви отримаєте її впродовж 24 годин.'
    },
    en: {
      name: 'Name cannot be blank',
      email: 'Email is not valid',
      message: 'Message cannot be blank',
      subject: 'Contact Form | GreatProse',
      success: 'Email has been sent successfully!'
    }
  };
  
  req.assert('name', str[lang].name).notEmpty();
  req.assert('email', str[lang].email).isEmail();
  req.assert('message', str[lang].message).notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/contact');
  }
  
  var options = {
    auth: {
      api_user: process.env.SENDGRID_USER,
      api_key: process.env.SENDGRID_PASSWORD
    }
  };
  
  const mailOptions = {
    to: res.locals.support_email,
    from: `${req.body.name} <${req.body.email}>`,
    subject: str[lang].subject,
    text: req.body.message,
    html: req.body.html || ''
  };  
  
  var client = nodemailer.createTransport(sgTransport(options));
  
  client.sendMail(mailOptions, (err) => {
    if (err) {
      req.flash('errors', { msg: err.message });
      return res.redirect('/contact');
    }
    req.flash('success', { msg: str[lang].success });
    res.redirect('/contact');
  });
};
