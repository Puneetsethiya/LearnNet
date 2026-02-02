const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.signup);
router.post('/login', userController.login);

router.post('/enroll', userController.enroll);
router.get('/enrollments/:username', userController.getEnrollments);
router.delete('/enrollments/:username/:courseName', userController.unenroll);

router.post('/reset-password', userController.resetPassword);


// completion
router.post('/completion', userController.saveCompletion);
router.get('/completion/:username/:courseName', userController.getCompletion);

module.exports = router;
