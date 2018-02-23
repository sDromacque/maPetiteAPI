const httpStatus = require('http-status');
const Domain = require('../models/domain.model');

/**
 * Get user
 * @public
 */
exports.list = (req, res) => {
  console.log('ok');
};

exports.listByDomain = (req, res) => {
  console.log('ok');
};

exports.create = async (req, res, next) => {
  try {
    const domain = new Domain(req.body);
    const savedDomain = await domain.save();
    res.status(httpStatus.CREATED).json(savedDomain);
  } catch (error) {
    next(error);
  }
};


exports.find = (req, res) => {
  console.log('ok');
};

exports.update = (req, res) => {
  console.log('ok');
};

