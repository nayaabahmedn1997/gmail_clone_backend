const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  folder: { type: String, enum: ['inbox', 'sent', 'drafts', 'trash'], default: 'inbox' },
  timestamp: { type: Date, default: Date.now },
  attachment:{type: String }
});

module.exports = mongoose.model('Email', emailSchema);