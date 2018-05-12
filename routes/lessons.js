var express = require('express');
var router = express.Router();
const passportConfig = require('../config/passport');
const lessonController = require('../controllers/lesson');
const genFunc = require('../controllers/gen_functions');

/* General paths */
router.get('/dashboard', passportConfig.isAuthenticated, lessonController.dashboard);
router.get('/:chapter/tutorial', passportConfig.isAuthenticated, lessonController.tutorial);
router.get('/explanation/:story', passportConfig.isAuthenticated, genFunc.checkAccount, lessonController.explanation);
router.get('/:story/:subj', passportConfig.isAuthenticated, genFunc.checkAccount, lessonController.lesson);
router.get('/story/diploma/read', passportConfig.isAuthenticated, genFunc.checkAccount, lessonController.readDiplomaStory);
//router.get('/story/:name/read', passportConfig.isAuthenticated, lessonController.readStory); //TODO

module.exports = router;