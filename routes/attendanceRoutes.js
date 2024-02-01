// // // routes/attendanceRoutes.js
// // const express = require('express');
// // const router = express.Router();
// // const attendanceController = require('../controllers/attendanceController');
// // const authenticateToken = require('../middleware/authenticateToken');

// // // Endpoint for coordinators to view attendance of all departments for a selected date
// // router.get('/coordinator/view/:date', authenticateToken, attendanceController.viewAllDepartmentsAttendance);

// // // Endpoint for coordinators to view and update attendance of their section for any year
// // router.get('/coordinator/:year/:class/:section/:date', authenticateToken, attendanceController.viewAndUpdateAttendance);

// // // Existing endpoints
// // router.get('/:date', authenticateToken, attendanceController.getAttendance);
// // router.post('/', authenticateToken, attendanceController.updateAttendance);
// // router.delete('/:id', authenticateToken, attendanceController.deleteAttendance);

// // module.exports = router;

// // routes/attendanceRoutes.js
// const express = require('express');
// const router = express.Router();
// const attendanceController = require('../controllers/attendanceController');
// const authenticate = require('../middleware/authenticate');

// // Middleware for authentication
// router.use(authenticate);

// // Routes
// router.post('/add-attendance', attendanceController.addAttendance);
// router.get('/get-attendance/:date', attendanceController.getAttendance);
// router.put('/update-attendance', attendanceController.updateAttendance);
// router.delete('/delete-attendance/:id', attendanceController.deleteAttendance);
// router.get('/view-all-departments-attendance/:date', attendanceController.viewAllDepartmentsAttendance);
// router.get('/view-and-update-attendance/:year/:class/:section/:date', attendanceController.viewAndUpdateAttendance);

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const attendanceController = require('../controllers/attendanceController');
// const authenticate = require('../middleware/authenticate');

// // router.use(authenticate);

// router.post('/add-attendance', attendanceController.addAttendance);
// router.get('/get-attendance/:date', attendanceController.getAttendance);
// router.put('/update-attendance', attendanceController.updateAttendance);
// router.delete('/delete-attendance/:id', attendanceController.deleteAttendance);
// router.get('/view-all-departments-attendance/:date', attendanceController.viewAllDepartmentsAttendance);
// router.get('/view-and-update-attendance/:year/:class/:section/:date', attendanceController.viewAndUpdateAttendance);

// module.exports = router;


// routes/attendanceRoutes.js

// const express = require('express');
// const router = express.Router();
// const attendanceController = require('../controllers/attendanceController');

// // Routes
// router.post('/add-attendance', attendanceController.addAttendance);
// router.get('/get-attendance/:date', attendanceController.getAttendance);
// router.put('/update-attendance', attendanceController.updateAttendance);
// router.delete('/delete-attendance/:id', attendanceController.deleteAttendance);

// module.exports = router;

// routes/attendanceRoutes.js

const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authenticate = require('../middleware/authenticate')

// Routes
router.post('/add-attendance',authenticate, attendanceController.addAttendance);
router.get('/get-attendance/:date?/:year?/:className?/:section?', authenticate,attendanceController.getAttendance);
router.put('/update-attendance', authenticate,attendanceController.updateAttendance);
router.delete('/delete-attendance/:id', authenticate,attendanceController.deleteAttendance);
router.get('/view-all-departments-attendance', authenticate,attendanceController.viewAllDepartmentsAttendance);
router.post('/view-and-update-attendance', authenticate,attendanceController.viewAndUpdateAttendance);

module.exports = router;
