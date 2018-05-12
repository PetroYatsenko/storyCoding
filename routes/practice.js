var express = require('express');
var router = express.Router();
const practiceController = require('../controllers/practice');
const passportConfig = require('../config/passport');
const genFunc = require('../controllers/gen_functions');

router.get('/heroes/:story', passportConfig.isAuthenticated, genFunc.checkAccount, practiceController.getMonstersCollection);
router.get('/story_builder/:story/:hero', passportConfig.isAuthenticated, genFunc.checkAccount, practiceController.getStoryBuilder);
router.get('/story_builder/arrange/:story/:hero/:title', passportConfig.isAuthenticated, genFunc.checkAccount, practiceController.arrangeStory);
router.get('/story_builder/diploma', passportConfig.isAuthenticated, genFunc.checkAccount, practiceController.arrangeDiploma);
router.get('/tests/:test', passportConfig.isAuthenticated, genFunc.checkAccount, practiceController.test);
router.get('/diploma/story', passportConfig.isAuthenticated, genFunc.checkAccount, practiceController.diploma);
// TODO add account checking function too
router.post('/story_builder/save', passportConfig.isAuthenticated, practiceController.saveStory);
router.post('/story_builder/diploma/save', passportConfig.isAuthenticated, practiceController.saveDiploma);
router.post('/tests/save', passportConfig.isAuthenticated, practiceController.saveTest);

module.exports = router;