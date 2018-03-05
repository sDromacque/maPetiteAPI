const mongoose = require('mongoose');

/**
 * Shoot Schema
 * @private
 */
const shootSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  startedAt: {
    type: Date,
  },
  data: {
    type: [],
  },
}, {
  timestamps: true,
  versionKey: false,
});


/**
 * @typedef Shoot
 */
module.exports = mongoose.model('Shoot', shootSchema);
