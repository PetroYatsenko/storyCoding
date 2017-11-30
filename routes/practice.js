var express = require('express');
var router = express.Router();
const practiceController = require('../controllers/practice');

router.get('/heroes', practiceController.getHeroes);

router.get('/story_builder', practiceController.getLoopBuilder);

router.get('/story_builder/arrange', practiceController.arrangeStory);

module.exports = router;