const _ = require('lodash');

module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    return next();
  }

  if (err.isBoom) {
    return res.status(err.output.statusCode).json(_.extend(
      {},
      err.output.payload,
      err.data ? { data: err.data } : undefined,
    ));
  }

  return next(err);
};
