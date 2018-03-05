
const express = require('express');
const controller = require('../../controllers/domain.controller');

const router = express.Router();

const {
  authorize,
  isSameDomain,
  DOMAIN_ADMIN,
  SUPER_ADMIN,
} = require('../../middlewares/auth');

router
  .route('/')
  .get(authorize(SUPER_ADMIN), controller.list)
  .post(authorize(SUPER_ADMIN), controller.create);

router
  .route('/:domainId')
  .get(isSameDomain(), controller.find)
  .patch(isSameDomain(), authorize([SUPER_ADMIN, DOMAIN_ADMIN]), controller.update);

module.exports = router;
