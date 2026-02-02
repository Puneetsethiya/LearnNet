const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Admin = require('../models/Admin');
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;


/* ================= ADMIN AUTH ================= */

exports.signup = async (req, res) => {
  try{
    const { username, password } = req.body;

   if(!username){
  return res.status(400).json({ message: "Username is required" });
}

if(password.length < 6){
  return res.status(400).json({ message: "Password must be at least 6 characters long" });
}


    const exists = await Admin.findOne({ username });
    if(exists){
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    await Admin.create({
      username,
      password: hashed
    });

    res.json({ message: "Admin registered successfully" });

  }catch(err){
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try{
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if(!admin || !(await bcrypt.compare(password, admin.password))){
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Admin login successful" });

  }catch(err){
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= ADMIN FEATURES ================= */

exports.getAdminCourses = async (req, res) => {
  try{
    const courses = await Course.find({});
    res.json(courses);
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCourse = async (req, res) => {
  try{
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if(!updated) return res.status(404).json({ message: 'Course not found' });
    res.json(updated);
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
};

exports.deleteCourse = async (req, res) => {
  try{
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if(!deleted) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted' });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Delete failed' });
  }
};

exports.overview = async (req, res) => {
  try{
    const enrollments = await Enrollment.find({});
    res.json({ totalEnrollments: enrollments.length, all: enrollments });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.resetPassword = async (req, res) => {
  try{
    const { username, newPassword } = req.body;

    if(!username){
      return res.status(400).json({ message: "Username is required" });
    }

    if(newPassword.length < 6){
      return res.status(400).json({ 
        message: "Password must be at least 6 characters long" 
      });
    }

    const admin = await Admin.findOne({ username });

    if(!admin){
      return res.status(404).json({ message: "Admin not found" });
    }

    admin.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await admin.save();

    res.json({ message: "Password reset successful" });

  }catch(err){
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.deleteEnrollment = async (req, res) => {
  try{
    const { username, courseName } = req.body;

    const deleted = await Enrollment.findOneAndDelete({ username, courseName });

    const Completion = require('../models/Completion');
    await Completion.deleteOne({ username, courseName });

    if(!deleted) return res.status(404).json({ message: 'Enrollment not found' });

    res.json({ message: 'Enrollment deleted' });

  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
