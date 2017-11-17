var express = require('express');
var router = express.Router();

const lessonController = require('../controllers/lesson');

/* Get user`s lesson */
router.get('/pompon', lessonController.pomponMonster);

router.get('/pompon/how-its-made', lessonController.howPomponMade);

module.exports = router;