const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const domainRoutes = require('./domain.route');
const groupRoutes = require('./group.route');
const shootRoutes = require('./shoot.route');

const router = express.Router();

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

router.use('/user', userRoutes);
router.use('/auth', authRoutes);
router.use('/domain', domainRoutes);
router.use('/group', groupRoutes);
router.use('/shoot', shootRoutes);

module.exports = router;
