var express = require('express');
var router = express.Router();
const passportConfig = require('../config/passport');
const lessonController = require('../controllers/lesson');

/* General paths */
router.get('/dashboard', passportConfig.isAuthenticated, lessonController.dashboard);
router.get('/explanation', passportConfig.isAuthenticated, lessonController.explanation);
router.get('/dashboard/tutorial', passportConfig.isAuthenticated, lessonController.tutorial);
router.get('/story/tutorial', passportConfig.isAuthenticated, lessonController.tutorial);
router.get('/practice/tutorial', passportConfig.isAuthenticated, lessonController.tutorial);

/* Get user`s lesson */
router.get('/:story/:subj', passportConfig.isAuthenticated, lessonController.lesson);

module.exports = router;