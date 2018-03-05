const mongoose = require('mongoose');

/**
 * Way Schema
 * @private
 */
const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  domain: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Domain',
  },
}, {
  timestamps: true,
});


/**
 * @typedef Group
 */
module.exports = mongoose.model('Group', groupSchema);
