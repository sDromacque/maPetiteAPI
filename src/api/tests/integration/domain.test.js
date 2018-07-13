/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-expressions */
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const bcrypt = require('bcryptjs');
const app = require('../../../index');
const User = require('../../models/user.model');
const Domain = require('../../models/domain.model');

describe('Domains API', async () => {
  let adminAccessToken;
  let superAdminAccessToken;
  let dbUsers;
  let dbDomains;

  let domainValid;

  const password = '123456';
  const passwordHashed = await bcrypt.hash(password, 1);

  beforeEach(async () => {
    dbDomains = {
      mel: {
        name: 'toto',
      },
    };

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
    await Domain.remove({});
    await Domain.insertMany([dbDomains.mel]);
    dbUsers.branStark.password = password;
    dbUsers.jonSnow.password = password;
    dbUsers.gregorClegane.password = password;
    adminAccessToken = (await User.findAndGenerateToken(dbUsers.branStark)).accessToken;
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

  describe('GET /v1/domains', () => {
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

    it('should return 200 when user is authorize', () => {
      return request(app)
        .get('/v1/domains')
        .set('Authorization', `Bearer ${superAdminAccessToken}`)
        .send(domainValid)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
        });
    });
  });
});
