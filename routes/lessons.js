var express = require('express');
var router = express.Router();

const lessonController = require('../controllers/lesson');

/* Get user`s lesson */
router.get('/pompon', lessonController.pomponMonster);

router.get('/pompon/explanation', lessonController.howPomponMade);

module.exports = router;