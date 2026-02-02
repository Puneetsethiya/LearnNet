const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
{
  username: { 
    type: String, 
    required: true 
  },

  courseName: { 
    type: String, 
    required: true 
  },
},
{
  timestamps: true 
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);
