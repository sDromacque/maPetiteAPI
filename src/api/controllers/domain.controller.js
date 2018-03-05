const httpStatus = require('http-status');
const Domain = require('../models/domain.model');

/**
 * Get user
 * @public
 */
exports.list = (req, res, next) => {
  Domain.find()
    .then((results) => {
      res.json(results);
    })
    .catch(next);
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


exports.find = (req, res, next) => {
  Domain.find()
    .then((results) => {
      res.json(results);
    })
    .catch(next);
};


exports.update = (req, res) => {
  res.json('ok update');
};

