const router = require('express').Router(),
usersController = require('../controllers/usersController');

router.get('/', usersController.index, usersController.indexView);
router.get('/new', usersController.new);
router.post('/create', usersController.validate, usersController.create, usersController.redirectView);

module.exports = router;