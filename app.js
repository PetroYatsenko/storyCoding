/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const mongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const sass = require('node-sass-middleware');
const redisClient = require('redis').createClient();
const helmet = require('helmet');
const winston = require('./config/winston');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env' });

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
const app = express();

const limiter = require('express-limiter')(app, redisClient);
/**
 * Bots protection. Limits requests to 100 per hour per ip address.
 */
limiter({
  lookup: ['connection.remoteAddress'],
  total: 100,
  expire: 1000 * 60 * 60
});

/**
 * Connect to MongoDB.
 */
mongoose.Promise = require('bluebird');

mongoose.connect(process.env.MONGODB_URI, {
// Options
  user: process.env.MONGODB_USER,
  pass: process.env.MONGODB_PASS,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
});
mongoose.connection.on('error', (err) => {
  winston.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// TODO language support
app.use(function(req, res, next){
  res.locals = {
    lang: 'uk',
    siteLogo: 'ЧудоваПроза',
    siteTitle: "Чудова проза",
    siteTitleLong: 'Навчальна платформа "Чудова проза"',
    siteDescription: 'Креативне письмо та основи програмування: легко, весело й вичерпно. \n\
      Навчальний курс розроблено спеціально для гуманітаріїв.',
    course_id: 'storycoding',
    course_name: 'Програмуємо... страшні історії!', //TODO pass to the home page too
    url: 'www.greatprose.com',
    support_email: 'support@greatprose.com',    
    info_email: 'info@greatprose.com',
    noreply_email: 'noreply@greatprose.com',
    support_phone: '+38 098 61 55 611',
    support_address: 'м. Львів, вул. Стефаника, 7/1, 79000', //TODO 
    global_str: {
      sandbox: 'пісочниця',
      basic: 'учень',
      advanced: 'родина',
      premium: 'гурток',
      devel: 'devel',
      editor: 'редактор',
      admin: 'адмін',
      beta: '&beta;'
    },
    prices: {
      basic: '299',
      advanced: '749',
      premium: '999',
      suffix: '.00'
    }
  };  
  
  next();
});
/**
 * Vulnerabilities protection
 */
app.use(helmet());

app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
app.use(morgan('combined', { stream: winston.stream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  key: process.env.KEY,
//  cookie: {
//    secure: true, // Enable and test when SSL added 
//    domain: process.env.DOMAIN, // Enable on production
     // Cookie will expire in 1 hour from when it's generated
//    expires: new Date( Date.now() + 60 * 60 * 1000 )
//  },
// ********************
  store: new mongoStore({
   mongooseConnection: mongoose.connection,
     collection: 'sessions' // default
  })
// *********************
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.csrf());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
      req.path !== '/login' &&
      req.path !== '/signup' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user &&
      req.path === '/account') {
    req.session.returnTo = req.path;
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

// Get basic StoryCoding routes
const index = require('./routes/index');
const lessons = require('./routes/lessons');
const practice = require('./routes/practice');
const users = require('./routes/users');
const api = require('./routes/api');
const auth = require('./routes/auth');
const contact = require('./routes/contact');

/**
 * Primary app routes.
 */
app.use('/', index);
app.use('/', users); // TODO replace with users
app.use('/', contact); //TODO add contact
app.use('/lessons', lessons);
app.use('/practice', practice);
app.use('/api', api);
app.use('/auth', auth);

/**
 * Error Handling segment
 */
if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler());
}; 
app.use((req, res, next) => {
  winston.error(`404 - not found - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  res.render('errors/404', {
    status: 404,
    url: req.url, //TODO - not used
  });
});
app.use((err, req, res, next) => {
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  res.render('errors/500', {
    status: err.status || 500
  });
});

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  winston.log('%s App is running at port:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
});

module.exports = app;
