
const express = require('express');
const controller = require('../../controllers/domain.controller');

const router = express.Router();

const {
  authorize,
  isSameDomain,
  DOMAIN_ADMIN,
  SUPER_ADMIN,
} = require('../../middlewares/auth');

router
  .route('/')
  /**
  * @api {get} v1/domain List Domains
  * @apiDescription Get a list of domains
  * @apiVersion 1.0.0
  * @apiName ListDomains
  * @apiGroup Domain
  * @apiPermission superAdmin
  *
  * @apiHeader {String} Athorization  User's access token
  *
  * @apiParam {ObjectId} id Domain unique ID.
  *
  * @apiSuccess {Object[]} domains List of domains.
  *
  * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
  * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
  */
  .get(authorize(SUPER_ADMIN), controller.list)
  /**
   * @api {post} v1/domain Create Domain
   * @apiDescription Create a new domain
   * @apiVersion 1.0.0
   * @apiName CreateDomain
   * @apiGroup Domain
   * @apiPermission superAdmin
   *
   * @apiHeader {String} Athorization  User's access token
   *
   * @apiParam  {String} Name Name domain
   *
   * @apiSuccess (Created 201) {String}  id         Domain's id
   * @apiSuccess (Created 201) {String}  name       Domain's name
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   * @apiSuccess (Created 201) {Boolean} isActive   Bool
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize(SUPER_ADMIN), controller.create);

router
  .route('/:domainId')
  /**
   * @api {post} v1/domain/:domainId Get User
   * @apiDescription Create a new domain
   * @apiVersion 1.0.0
   * @apiName CreateDomain
   * @apiGroup Domain
   * @apiPermission superAdmin domainAdmin
   *
   * @apiHeader {String} Athorization  User's access token
   *
   * @apiParam  {String} Name Name domain
   *
   * @apiSuccess (Created 201) {String}  id         Domain's id
   * @apiSuccess (Created 201) {String}  name       Domain's name
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   * @apiSuccess (Created 201) {Boolean} isActive   Bool
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .get(controller.find)
  .patch(isSameDomain(), authorize([SUPER_ADMIN, DOMAIN_ADMIN]), controller.update);

module.exports = router;
