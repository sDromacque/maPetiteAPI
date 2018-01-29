const boom = require('boom');

/**
 * Catch 404 and return boom error
 * @public
 */
module.exports = (req, res, next) => next(boom.notFound());
