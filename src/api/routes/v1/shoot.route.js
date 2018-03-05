
const express = require('express');
const controller = require('../../controllers/shoot.controller');

const router = express.Router();

router
  .route('/')
  .post(controller.create);

module.exports = router;
