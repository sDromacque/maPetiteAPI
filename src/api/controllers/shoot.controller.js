const httpStatus = require('http-status');
const Shoot = require('../models/shoot.model');


exports.create = async (req, res, next) => {
  try {
    const shoot = new Shoot({
      name: req.body.name,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      startedAt: req.body.startedAt,
      data: req.body.data.data,
    });
    const savedShoot = await shoot.save();
    res.status(httpStatus.CREATED).json(savedShoot);
  } catch (error) {
    next(error);
  }
};
