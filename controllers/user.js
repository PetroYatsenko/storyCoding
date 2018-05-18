const bluebird = require('bluebird');
const crypto = bluebird.promisifyAll(require('crypto'));
const nodemailer = require('nodemailer');
const passport = require('passport');
const User = require('../models/User');

/**
 * GET /login
 * Login page.
 */
exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  var lang = res.locals.lang;         
  var strings = {
    uk: {
      log_in: 'Вхід'
    }
  }; 
  res.render('account/login', {
    title: strings[lang].log_in
  });
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
  var lang = res.locals.lang;         
  var str = {
    uk: {
      email_err: 'Зверніть увагу: вірогідно, помилка в адресі вашої електронної пошти.',
      passw_err_empty: 'Зверніть увагу: поле для пароля не може залишатися порожнім',
      success_login: 'Успіх! Ви залогувалися.'
    }
  }; 
  req.assert('email', str[lang].email_err).isEmail(); //'Email is not valid'
  req.assert('password', str[lang].passw_err_empty).notEmpty(); //'Password cannot be blank'
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/login');
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash('errors', info);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: str[lang].success_login });
      res.redirect(req.session.returnTo || '/lessons/dashboard'); //req.session.returnTo || '/'
    });
  })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  var lang = res.locals.lang;         
  var strings = {
    uk: {
      sign_up: 'Реєстрація'
    }
  }; 
  res.render('account/signup', {
    title: strings[lang].sign_up
  });
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res, next) => {
  var lang = res.locals.lang;         
  var str = {
    uk: {
      email_err: 'Зверніть увагу: вірогідно, помилка в адресі вашої електронної пошти.',
      email_err_acc: 'Зверніть увагу: профіль з такою адресою електронної пошти вже існує.',
      passw_err_width: 'Зверніть увагу: пароль має бути довжиною принаймні 8 символів.',
      passw_err_match: 'Зверніть увагу: паролі не збігаються.',
    }
  }; 
  req.assert('email', str[lang].email_err).isEmail(); //'Email is not valid'
  req.assert('password', str[lang].passw_err_width).len(8); //'Password must be at least 8 characters long'
  req.assert('confirmPassword', str[lang].passw_err_match).equals(req.body.password);// 'Passwords do not match'
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/signup');
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      req.flash('errors', {msg: str[lang].email_err_acc}); // 'Account with that email address already exists.'
      return res.redirect('/signup');
    }
    user.save((err) => {
      if (err) { return next(err); }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
  });
};

/**
 * GET /account
 * Profile page.
 */
exports.getAccount = (req, res) => {
  var lang = res.locals.lang;         
  var str = {
    uk: {
      my_acc: 'Мій профіль',
    }
  }; 
  res.render('account/profile', {
    title: str[lang].my_acc // Account Management
  });
};

/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = (req, res, next) => {
  var lang = res.locals.lang;         
  var str = {
    uk: {
      email_err: 'Зверніть увагу: вірогідно, помилка в адресі вашої електронної пошти.',
      email_err_acc: 'Зверніть увагу: профіль з такою адресою електронної пошти вже існує.',
      email_suc_upd: 'Інформацію профілю успішно оновлено.' 
    }
  }; 
  req.assert('email', str[lang].email_err).isEmail(); //'Please enter a valid email address.'
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.email = req.body.email || '';
    user.profile.name = req.body.name || '';
    user.profile.gender = req.body.gender || '';
    user.profile.location = req.body.location || '';
    user.profile.website = req.body.website || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', {msg: str[lang].email_err_acc}); // 'The email address you have entered is already associated with an account.'
          return res.redirect('/account');
        }
        return next(err);
      }
      req.flash('success', {msg: str[lang].email_suc_upd}); //'Profile information has been updated.'
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = (req, res, next) => {
  var lang = res.locals.lang;         
  var str = {
    uk: {
      passw_err_width: 'Зверніть увагу: пароль має бути довжиною принаймні 8 символів.',
      passw_err_match: 'Зверніть увагу: паролі не збігаються.',
      passw_suc_upd: 'Пароль успішно змінено.'
    }
  };
  req.assert('password', str[lang].passw_err_width).len(8); //'Password must be at least 8 characters long'
  req.assert('confirmPassword', str[lang].passw_err_match).equals(req.body.password);// 'Passwords do not match'

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.password = req.body.password;
    user.save((err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: str[lang].passw_suc_upd});//'Password has been changed.'
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = (req, res, next) => {
  var lang = res.locals.lang;         
  var str = {
    uk: {
      acc_suc_del: 'Ваш профіль успішно закрито. Хоча нам дуже шкода. Повертайтеся!'
    }
  };
  User.remove({ _id: req.user.id }, (err) => {
    if (err) { return next(err); }
    req.logout();
    req.flash('info', {msg: str[lang].acc_suc_del});// 'Your account has been deleted.'
    res.redirect('/');
  });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = (req, res, next) => {
  const provider = req.params.provider;
  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user[provider] = undefined;
    user.tokens = user.tokens.filter(token => token.kind !== provider);
    user.save((err) => {
      if (err) { return next(err); }
      req.flash('info', { msg: `${provider} account has been unlinked.` }); // TODO
      res.redirect('/account');
    });
  });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  var lang = res.locals.lang;         
  var str = {
    uk: {
      passw_reset: 'Зміна пароля',
      passw_err_reset: 'Зверніть увагу: лінк на зміну пароля неправильний або термін його дії закінчився.'
    }
  }; 
  User
    .findOne({ passwordResetToken: req.params.token })
    .where('passwordResetExpires').gt(Date.now())
    .exec((err, user) => {
      if (err) { return next(err); }
      if (!user) {
        req.flash('errors', { msg: str[lang].passw_err_reset});//'Password reset token is invalid or has expired.'
        return res.redirect('/forgot');
      }
      res.render('account/reset', {
        title: str[lang].passw_reset//'Password Reset'
      });
    });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = (req, res, next) => {
  var lang = res.locals.lang;
  var str = {
    uk: {
      passw_suc_reset: 'Ми успішно змінили ваш пароль',
      passw_err_width: 'Зверніть увагу: пароль має бути довжиною принаймні 8 символів.',
      passw_err_match: 'Зверніть увагу: паролі не збігаються.',
      passw_err_reset: 'Зверніть увагу: лінк на зміну пароля неправильний або термін його дії закінчився.',
      passw_changed_mail_txt: `Вітаємо!\n\n Ваш пароль до профілю ${user.email} був щойно змінений. Якщо це зроблено без вашого відома, будь ласка, негайно зв'яжіться з технічною підтримкою: ${res.locals.email} \n\n З повагою, навчальна платформа ${res.locals.siteTitle}`
    },
    en: {
      passw_changed_mail_txt: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
    }
  }; 
  req.assert('password', str[lang].passw_err_width).len(8); //'Password must be at least 8 characters long.'
  req.assert('confirm', str[lang].passw_err_match).equals(req.body.password);//'Passwords must match.'

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('back');
  }

  const resetPassword = () =>
    User
      .findOne({ passwordResetToken: req.params.token })
      .where('passwordResetExpires').gt(Date.now())
      .then((user) => {
        if (!user) {
          req.flash('errors', {msg: str[lang].passw_err_reset});//'Password reset token is invalid or has expired.'
          return res.redirect('back');
        }
        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        return user.save().then(() => new Promise((resolve, reject) => {
          req.logIn(user, (err) => {
            if (err) { return reject(err); }
            resolve(user);
          });
        }));
      });

  const sendResetPasswordEmail = (user) => {
    if (!user) { return; }
    const transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
    const mailOptions = {
      to: user.email,
      from: res.locals.email,
      subject: str[lang].passw_suc_reset,
      text: str[lang].passw_changed_mail_txt};
    return transporter.sendMail(mailOptions)
      .then(() => {
        req.flash('success', {msg: str[lang].passw_suc_reset}); //'Success! Your password has been changed.'
      });
  };

  resetPassword()
    .then(sendResetPasswordEmail)
    .then(() => { if (!res.finished) res.redirect('/'); })
    .catch(err => next(err));
};

/**
 * GET /forgot
 * Forgot Password page.
 */
exports.getForgot = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  var lang = res.locals.lang;
  var str = {
    uk: {
      passw_forgot: 'Забули пароль'
    }
  }; 
  res.render('account/forgot', {
    title: str[lang].passw_forgot,//'Forgot Password'
  });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = (req, res, next) => {
  var lang = res.locals.lang;         
  var str = {
    uk: {
      email_err: 'Зверніть увагу: вірогідно, адреса вашої електронної пошти містить помилку.',
      email_err_acc: 'Зверніть увагу: профілю з такою адресою електронної пошти не існує.',
      passw_reset_mail_theme: `Запит на зміну вашого пароля на платформі ${res.locals.siteLogo}`,
      passw_change_msg: `Ми надіслали електронного листа на твою адресу ${user.email}. Там написано, що робити далі.`,
      passw_change_mail_txt: `Ви отримали цього листа, тому що ви (або хто-небудь інший) надіслали запит на зміну пароля до вашого профілю.\n\n
        Будь ласка, клікніть на лінк або скопіюйте його до вашого веб-браузера, щоби завершити процес:\n\n
        http://${req.headers.host}/reset/${token}\n\n
        Якщо ви не надсилали запиту на зміню пароля, будь ласка, проігноруйте цей лист, і ваш пароль залишиться без змін.\n`
    },
    en: {
      passw_change_mail_txt: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      passw_change_msg: `An e-mail has been sent to ${user.email} with further instructions.`
    }
  }; 
  req.assert('email', str[lang].email_err).isEmail();//'Please enter a valid email address.'
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/forgot');
  }

  const createRandomToken = crypto
    .randomBytesAsync(16)
    .then(buf => buf.toString('hex'));

  const setRandomToken = token =>
    User
      .findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('errors', {msg: str[lang].email_err_acc});//'Account with that email address does not exist.'
        } else {
          user.passwordResetToken = token;
          user.passwordResetExpires = Date.now() + 3600000; // 1 hour
          user = user.save();
        }
        return user;
      });

  const sendForgotPasswordEmail = (user) => {
    if (!user) { return; }
    const token = user.passwordResetToken;
    const transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
    const mailOptions = {
      to: user.email,
      from: res.locals.email,
      subject: str[lang].passw_reset_mail_theme,
      text: str[lang].passw_change_mail_txt
    };
    return transporter.sendMail(mailOptions)
      .then(() => {
        req.flash('info', { msg: str[lang].passw_change_msg});
      });
  };

  createRandomToken
    .then(setRandomToken)
    .then(sendForgotPasswordEmail)
    .then(() => res.redirect('/forgot'))
    .catch(next);
};
