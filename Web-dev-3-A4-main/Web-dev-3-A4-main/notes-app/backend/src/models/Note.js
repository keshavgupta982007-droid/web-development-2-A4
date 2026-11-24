const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, trim: true, maxlength: 120, default: '' },
    content: { type: String, trim: true, maxlength: 5000, default: '' },
    color: { type: String, enum: ['yellow', 'mint', 'sky', 'rose', 'lilac'], default: 'yellow' },
    tags: { type: [String], default: [] },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);
