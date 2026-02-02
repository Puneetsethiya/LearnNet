const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

/* ===== ADMIN AUTH ===== */

router.post('/signup', adminController.signup);
router.post('/login', adminController.login);

/* ===== ADMIN FEATURES ===== */

router.get('/courses', adminController.getAdminCourses);
router.put('/courses/:id', adminController.updateCourse);
router.delete('/courses/:id', adminController.deleteCourse);

router.get('/overview', adminController.overview);
router.delete('/delete-enrollment', adminController.deleteEnrollment);
router.post('/reset-password', adminController.resetPassword);

module.exports = router;
