const Course = require('../models/Course');

exports.getAllCourses = async (req, res) => {
  try{
    const courses = await Course.find({});
    res.json(courses);
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
};

exports.getCourseByName = async (req, res) => {
  try{
    const course = await Course.findOne({ name: req.params.name });
    res.json(course);
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch course' });
  }
};

exports.addCourse = async (req, res) => {
  try{
    const course = await Course.create(req.body);
    res.json(course);
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Failed to add course' });
  }
};
