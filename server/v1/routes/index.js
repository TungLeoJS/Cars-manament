const router = require('express').Router();

router.use('/brand', require('./brand'));
router.use('/model', require('./model'));

module.exports = router;
