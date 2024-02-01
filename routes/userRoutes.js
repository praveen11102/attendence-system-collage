// // routes/userRoutes.js
// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');

// router.post('/register', userController.registerUser);
// router.post('/login', userController.loginUser);

// module.exports = router;

// // routes/userRoutes.js
// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');
// const authenticateToken = require('../middleware/authenticateToken');

// // Registration route (does not require a token)
// router.post('/register', userController.registerUser);

// // Login route (does not require a token)
// router.post('/login', userController.loginUser);

// module.exports = router;


const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

module.exports = router;
