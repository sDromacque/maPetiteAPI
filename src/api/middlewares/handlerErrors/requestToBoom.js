const boom = require('boom');

module.exports = (err, req, res, next) => {
  let boomError = {};

  switch (err.name) {
    case 'StatusCodeError':
      // Error returned by microservice
      switch (err.statusCode) {
        case 503:
        case 0:
          boomError = boom.serverUnavailable();
          break;
        case 404:
        case 500:
        default:
          boomError = boom.badImplementation();
      }
      break;
    case 'RequestError':
      // Protocol error, etc
      boomError = boom.wrap(err.error, 503);
      break;
    case 'TransformError':
      // Error during error handling
      boomError = boom.wrap(err, 500);
      break;
    default:
      boomError = boom.badRequest('Unknown error');
      break;
  }

  return next(boomError);
};
