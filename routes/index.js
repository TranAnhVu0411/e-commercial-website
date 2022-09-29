const router = require('express').Router(),
userRoutes = require('./userRoutes'),
salerRoutes = require('./salerRoutes');

router.use('/salers', salerRoutes);
router.use('/users', userRoutes);

module.exports = router;