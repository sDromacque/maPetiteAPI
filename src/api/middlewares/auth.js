const httpStatus = require('http-status');
const passport = require('passport');
const User = require('../models/user.model');
const APIError = require('../utils/APIError');
const boom = require('boom');
const _ = require('lodash');

const USER = 'user';
const ADMIN = 'admin';
const GROUP_ADMIN = 'groupAdmin';
const DOMAIN_ADMIN = 'domainAdmin';
const SUPER_ADMIN = 'superAdmin';

/**
 * Check if user is logged before check ACL
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const islogged = (req, res, next) => async (err, user, info) => {
  if (!_.isNil(info)) {
    return next(boom.unauthorized('Wrong token or expired token'));
  }
  return next();
};

const sameDomain = (req, res, next) => async (err, user) => {
  // TODO: find for convert params in objectID
  if (user.role === SUPER_ADMIN || user.domain.toString() === req.params.domainId) {
    res.json(httpStatus.CREATED);
  }
  return next(boom.unauthorized());
};

const handleJWT = (req, res, next, roles) => async (err, user, info) => {
  const error = err || info;
  const logIn = Promise.promisify(req.logIn);

  if (!roles.includes(user.role)) {
    return next(boom.unauthorized());
  }

  const apiError = new APIError({
    message: error ? error.message : 'Unauthorized',
    status: httpStatus.UNAUTHORIZED,
    stack: error ? error.stack : undefined,
  });

  try {
    if (error || !user) throw error;
    await logIn(user, { session: false });
  } catch (e) {
    return next(apiError);
  }

  if (roles === USER) {
    if (user.role !== 'admin' && req.params.userId !== user._id.toString()) {
      apiError.status = httpStatus.FORBIDDEN;
      apiError.message = 'Forbidden';
      return next(apiError);
    }
  } else if (!roles.includes(user.role)) {
    apiError.status = httpStatus.FORBIDDEN;
    apiError.message = 'Forbidden';
    return next(apiError);
  } else if (err || !user) {
    return next(apiError);
  }
  req.user = user;
  return next();
};

exports.USER = USER;
exports.ADMIN = ADMIN;
exports.GROUP_ADMIN = GROUP_ADMIN;
exports.DOMAIN_ADMIN = DOMAIN_ADMIN;
exports.SUPER_ADMIN = SUPER_ADMIN;

exports.authorize = (roles = User.roles) => (req, res, next) =>
  passport.authenticate(
    'jwt', { session: false },
    handleJWT(req, res, next, roles),
  )(req, res, next);

exports.islogged = () => (req, res, next) =>
  passport.authenticate(
    'jwt', { session: false },
    islogged(req, res, next),
  )(req, res, next);

exports.isSameDomain = () => (req, res, next) =>
  passport.authenticate(
    'jwt', { session: false },
    sameDomain(req, res, next),
  )(req, res, next);
