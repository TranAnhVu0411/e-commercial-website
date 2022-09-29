const router = require('express').Router(),
salersController = require('../controllers/salersController');

router.get('/', salersController.index, salersController.indexView);
router.get('/new', salersController.new);
router.post('/create', salersController.validate, salersController.create, salersController.redirectView);

module.exports = router;