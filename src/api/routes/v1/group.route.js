const express = require('express');
const controller = require('../../controllers/group.controller');

const router = express.Router();

const {
  authorize,
  SUPER_ADMIN,
} = require('../../middlewares/auth');

router
  .route('/')
  .post(controller.create)
  /*.post(controller.create); */

/* router
  .route('/domainId')
  .get(controller.find)
  .patch(controller.update); */

module.exports = router;
