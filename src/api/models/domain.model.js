const mongoose = require('mongoose');

/**
 * Domain Schema
 * @private
 */
const domainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
}, {
  timestamps: true,
});


/**
 * @typedef Domain
 */
module.exports = mongoose.model('Domain', domainSchema);
