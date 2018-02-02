const _ = require('lodash');
const boom = require('boom');

module.exports = (err, req, res, next) => {
  let boomError = {};
  const joinError = err.message === 'validation error' ? 'joinError' : undefined;

  switch (joinError || err.name) {
    case 'joinError': {
      const error = new Error(err.message);
      boomError = boom.boomify(error, {
        statusCode: err.status,
        data: _.map(err.errors, 'field'),
      });
      break;
    }
    case 'MongoError':
      boomError = boom.badRequest();
      break;
    case 'CastError':
      // Malformed id
      boomError = boom.badRequest(null, [err.path]);
      break;
    case 'ValidationError':
      // Handle conflict error
      if (_.some(err.errors, { kind: 'Duplicate value' })) {
        boomError = boom.conflict(null, _(err.errors)
          .filter({ kind: 'Duplicate value' })
          .map('path')
          .value());
        break;
      }
      boomError = boom.badRequest(null, _.map(err.errors, 'path'));
      break;
    default: {
      const error = new Error(err.output.payload.message);
      boomError = boom.boomify(error, {
        statusCode: err.output.statusCode,
        message: err.output.error,
      });
      break;
    }
  }

  return next(boomError);
};
