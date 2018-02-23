const httpStatus = require('http-status');
const { omit } = require('lodash');
const Group = require('../models/group.model');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


/**
 * Get user
 * @public
 */
exports.create = (req, res) => {
  const author = new Group({
    name: 'rd5',
    users: [
      { user: ObjectId('5a8adeaed5199f04ba8fcadc') },
      { user: ObjectId('5a8adeaed5199f04ba8fcade'), role: 'admin' },
    ],
    services: ['price', 'budget']
  });
  author.save(function(error) {
    console.log(error)
  })
};
