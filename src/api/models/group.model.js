const mongoose = require('mongoose');

const roles = ['superAdmin', 'domainAdmin', 'groupAdmin', 'user', 'admin'];

/**
 * Domain Schema
 * @private
 */
const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  users: [
    {
      _id: false,
      user: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
      role: {
        type: String,
        enum: roles,
        default: 'user',
      },
    },
  ],
  services: [{
    type: String,
    enum: ['price', 'calculation', 'budget'],
  }],
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
