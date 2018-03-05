const _ = require('lodash');
const boom = require('boom');

const convertErrors = errors => errors.map(error => error.messages[0].replace(/"/g, ''));

module.exports = (err, req, res, next) => {
  let boomError = {};
  const joinError = err.message === 'validation error' ? 'joinError' : undefined;

  switch (joinError || err.name) {
    case 'joinError': {
      const error = new Error(convertErrors(err.errors));
      boomError = boom.boomify(error, {
        statusCode: err.status,
        data: [].concat(..._.map(err.errors, ('field'))),
      });
      break;
    }
    case 'MongoError':
      boomError = boom.badRequest();
      break;
    case 'CastError':
      // Malformed id
      boomError = boom.badRequest('Malformed id', [err.path]);
      break;
    case 'SyntaxError':
      // SyntaxError
      boomError = boom.badRequest('Error in JSON');
      break;
    case 'APIError':
      // JWT error
      boomError = boom.forbidden('Access not allowed');
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
      console.log(err)
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
