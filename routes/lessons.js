var express = require('express');
var router = express.Router();
const passportConfig = require('../config/passport');
const lessonController = require('../controllers/lesson');

/* General paths */
router.get('/dashboard', passportConfig.isAuthenticated, lessonController.dashboard);
router.get('/explanation', passportConfig.isAuthenticated, lessonController.explanation);

/* Get user`s lesson */
router.get('/:monster', passportConfig.isAuthenticated, lessonController.lesson);

module.exports = router;