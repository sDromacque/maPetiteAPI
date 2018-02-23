const express = require('express');
const controller = require('../../controllers/domain.controller');

const router = express.Router();

const {
  authorize,
  SUPER_ADMIN,
} = require('../../middlewares/auth');

router
  .route('/')
  .get(authorize(SUPER_ADMIN), controller.list)
  .post(authorize(SUPER_ADMIN), controller.create);

module.exports = router;
