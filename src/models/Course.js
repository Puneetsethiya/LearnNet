const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  parts: [
    { title: String, youtubeId: String }
  ],
  subCourses: [
    {
      name: String,
      description: String,
      parts: [ { title: String, youtubeId: String } ]
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', CourseSchema);
