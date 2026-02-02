const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.get('/courses', courseController.getAllCourses);
router.get('/course/:name', courseController.getCourseByName);
router.post('/course', courseController.addCourse);

module.exports = router;
