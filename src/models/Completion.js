const mongoose = require('mongoose');

const CompletionSchema = new mongoose.Schema({
  username: { type: String, required: true },
  courseName: { type: String, required: true },
  completedLessons: { type: [Number], default: [] },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Completion', CompletionSchema);
