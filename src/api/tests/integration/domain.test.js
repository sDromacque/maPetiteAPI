/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-expressions */
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const bcrypt = require('bcryptjs');
const { omitBy, isNil } = require('lodash');
const app = require('../../../index');
const User = require('../../models/user.model');

/**
 * root level hooks
 */

async function format(user) {
  const formated = user;

  // delete password
  delete formated.password;

  // get users from database
  const dbUser = (await User.findOne({ email: user.email })).transform();

  // remove null and undefined properties
  return omitBy(dbUser, isNil);
}

describe('Users API', async () => {
  let adminAccessToken;
  let userAccessToken;
  let superAdminAccessToken;
  let dbUsers;
  let user;
  let admin;
  let superAdmin;

  let domainValid;

  const password = '123456';
  const passwordHashed = await bcrypt.hash(password, 1);

  beforeEach(async () => {
    dbUsers = {
      branStark: {
        email: 'branstark@gmail.com',
        password: passwordHashed,
        name: 'Bran Stark',
        role: 'admin',
      },
      jonSnow: {
        email: 'jonsnow@gmail.com',
        password: passwordHashed,
        name: 'Jon Snow',
      },
      gregorClegane: {
        email: 'gregorClegane@gmail.com',
        password: passwordHashed,
        name: 'Gregor Clegane',
        role: 'superAdmin',
      },
    };

    domainValid = {
      name: 'Baratheon',
    };

    await User.remove({});
    await User.insertMany([dbUsers.branStark, dbUsers.jonSnow, dbUsers.gregorClegane]);
    dbUsers.branStark.password = password;
    dbUsers.jonSnow.password = password;
    dbUsers.gregorClegane.password = password;
    adminAccessToken = (await User.findAndGenerateToken(dbUsers.branStark)).accessToken;
    userAccessToken = (await User.findAndGenerateToken(dbUsers.jonSnow)).accessToken;
    superAdminAccessToken = (await User.findAndGenerateToken(dbUsers.gregorClegane)).accessToken;
  });

  describe('POST /v1/domains', () => {
    it('should return 403 when user is not superAdmin', () => {
      return request(app)
        .post('/v1/domains')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(domainValid)
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body.message).to.be.equal('Unauthorized');
        });
    });
    it('should return 200 when domain is created', () => {
      return request(app)
        .post('/v1/domains')
        .set('Authorization', `Bearer ${superAdminAccessToken}`)
        .send(domainValid)
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.a.property('_id');
          expect(res.body).to.have.a.property('name');
          expect(res.body).to.have.a.property('isActive').to.be.a('boolean');
        });
    });
  });
});
