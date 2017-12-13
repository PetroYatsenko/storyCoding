var express = require('express');
var router = express.Router();
const passportConfig = require('../config/passport');
const lessonController = require('../controllers/lesson');

/* Lessons dashboard */
router.get('/dashboard', passportConfig.isAuthenticated, lessonController.dashboard);

/* Get user`s lesson */
router.get('/pompon', lessonController.pomponMonster);
router.get('/pompon/explanation', lessonController.explanation);

module.exports = router;