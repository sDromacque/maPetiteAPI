/* eslint-disable arrow-body-style */
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const sinon = require('sinon');
const app = require('../../../index');
const User = require('../../models/user.model');
const RefreshToken = require('../../models/refreshToken.model');

const sandbox = sinon.createSandbox();

describe.skip('Authentication API', () => {
  let dbUser;
  let user;
  let refreshToken;

  beforeEach(async () => {
    dbUser = {
      email: 'branstark@gmail.com',
      password: 'mypassword',
      name: 'Bran Stark',
      role: 'admin',
    };

    user = {
      email: 'sousa.dfs@gmail.com',
      password: '123456',
      name: 'Daniel Sousa',
    };

    refreshToken = {
      token: '5947397b323ae82d8c3a333b.c69d0435e62c9f4953af912442a3d064e20291f0d228c0552ed4be473e7d191ba40b18c2c47e8b9d',
      userId: '5947397b323ae82d8c3a333b',
      userEmail: dbUser.email,
      expires: new Date(),
    };

    await User.remove({});
    await User.create(dbUser);
    await RefreshToken.remove({});
  });

  afterEach(() => sandbox.restore());

  describe('POST /v1/auth/register', () => {
    it('should register a new user when request is ok', () => {
      return request(app)
        .post('/v1/auth/register')
        .send(user)
        .expect(httpStatus.CREATED)
        .then((res) => {
          delete user.password;
          expect(res.body.token).to.have.a.property('accessToken');
          expect(res.body.token).to.have.a.property('refreshToken');
          expect(res.body.token).to.have.a.property('expiresIn');
          expect(res.body.user).to.include(user);
        });
    });

    it('should report error when email already exists', () => {
      return request(app)
        .post('/v1/auth/register')
        .send(dbUser)
        .expect(httpStatus.CONFLICT)
        .then((res) => {
          expect(res.body).to.have.property('error');
          expect(res.body).to.have.property('message');
        });
    });

    it('should report error when the email provided is not valid', () => {
      user.email = 'this_is_not_an_email';
      return request(app)
        .post('/v1/auth/register')
        .send(user)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.data).to.be.a('array').to.not.empty;
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('email must be a valid email');
        });
    });

    it('should report error when email and password are not provided', () => {
      return request(app)
        .post('/v1/auth/register')
        .send({})
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.data).to.be.a('array').to.have.lengthOf(2);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('email is required,password is required');
        });
    });
  });

  describe('POST /v1/auth/login', () => {
    it('should return an accessToken and a refreshToken when email and password matches', () => {
      return request(app)
        .post('/v1/auth/login')
        .send(dbUser)
        .expect(httpStatus.OK)
        .then((res) => {
          delete dbUser.password;
          expect(res.body.token).to.have.a.property('accessToken');
          expect(res.body.token).to.have.a.property('refreshToken');
          expect(res.body.token).to.have.a.property('expiresIn');
          expect(res.body.user).to.include(dbUser);
        });
    });

    it('should report error when email and password are not provided', () => {
      return request(app)
        .post('/v1/auth/login')
        .send({})
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.data).to.be.a('array').to.have.lengthOf(2);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('email is required,password is required');
        });
    });

    it('should report error when the email provided is not valid', () => {
      user.email = 'this_is_not_an_email';
      return request(app)
        .post('/v1/auth/login')
        .send(user)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.data).to.be.a('array').to.not.empty;
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('email must be a valid email');
        });
    });

    it('should report error when email and password don\'t match', () => {
      dbUser.password = 'xxx';
      return request(app)
        .post('/v1/auth/login')
        .send(dbUser)
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body.message).to.be.equal('Access is required');
          expect(res.body.error).to.be.equal('Unauthorized');
        });
    });
  });

  describe('POST /v1/auth/refresh-token', () => {
    it('should return a new accessToken when refreshToken and email match', async () => {
      await RefreshToken.create(refreshToken);
      return request(app)
        .post('/v1/auth/refresh-token')
        .send({ email: dbUser.email, refreshToken: refreshToken.token })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('accessToken');
          expect(res.body).to.have.a.property('refreshToken');
          expect(res.body).to.have.a.property('expiresIn');
        });
    });

    it('should report error when email and refreshToken don\'t match', async () => {
      await RefreshToken.create(refreshToken);
      return request(app)
        .post('/v1/auth/refresh-token')
        .send({ email: user.email, refreshToken: refreshToken.token })
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body.message).to.be.equal('Incorrect email or refreshToken');
        });
    });

    it('should report error when email and refreshToken are not provided', () => {
      return request(app)
        .post('/v1/auth/refresh-token')
        .send({})
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.data).to.be.a('array').to.have.lengthOf(2);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('email is required,refreshToken is required');
        });
    });
  });
});
