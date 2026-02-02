const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Completion = require('../models/Completion');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

exports.signup = async (req, res) => {
  try{
    const { username, password } = req.body;
    if(await User.findOne({ username }))
      return res.status(400).json({ message: 'Username exists' });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    await User.create({ username, password: hashed });
    res.json({ message: 'User registered' });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try{
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if(!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ message: 'Login success' });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.enroll = async (req, res) => {
  try{
    const { username, courseName } = req.body;
    if(await Enrollment.findOne({ username, courseName }))
      return res.status(400).json({ message: 'Already enrolled' });
    await Enrollment.create({ username, courseName });
    res.json({ message: 'Enrolled successfully' });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getEnrollments = async (req, res) => {
  try{
    const data = await Enrollment.find({ username: req.params.username });
    res.json({ courses: data.map(e => e.courseName) });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.unenroll = async (req, res) => {
  try{
    const deleted = await Enrollment.findOneAndDelete({ username: req.params.username, courseName: req.params.courseName });
    // Remove any completion records for this user + course
    await Completion.deleteOne({ username: req.params.username, courseName: req.params.courseName });
    if(!deleted) return res.status(404).json({ message: 'Enrollment not found' });
    res.json({ message: 'Removed' });
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

    const user = await User.findOne({ username });

    if(!user){
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await user.save();

    res.json({ message: "Password reset successful" });

  }catch(err){
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Completion
exports.saveCompletion = async (req, res) => {
  try{
    const { username, courseName, lessonIndex } = req.body;
    let completion = await Completion.findOne({ username, courseName });
    if(!completion){
      completion = await Completion.create({ username, courseName, completedLessons: [lessonIndex] });
    }else{
      if(!completion.completedLessons.includes(lessonIndex)){
        completion.completedLessons.push(lessonIndex);
      }
      completion.updatedAt = Date.now();
      await completion.save();
    }
    res.json({ message: 'Completion saved', completed: completion.completedLessons });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCompletion = async (req, res) => {
  try{
    const completion = await Completion.findOne({ username: req.params.username, courseName: req.params.courseName });
    res.json({ completed: completion ? completion.completedLessons : [] });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
