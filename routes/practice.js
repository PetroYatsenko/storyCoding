var express = require('express');
var router = express.Router();
const practiceController = require('../controllers/practice');

router.get('/heroes', practiceController.getHeroes);

router.get('/story_builder', practiceController.getLoopBuilder);

module.exports = router;