// // controllers/userController.js
// const User = require('../models/userModel');
// const jwt = require('jsonwebtoken');
// const attendanceService = require('../services/attendanceService');


// const registerUser = async (req, res) => {
//     try {
//       const { username, password, role } = req.body;
  
//       // Validate email before saving
//       if (!username) {
//         return res.status(400).json({ error: 'Email is required' });
//       }
  
//       // Check if the email is unique
//       const existingUser = await User.findOne({ username });
//       if (existingUser) {
//         return res.status(400).json({ error: 'Email is already registered' });
//       }
  
//       const user = new User({ username, password, role });
//       user.generateOTP();
//       await user.save();
//       await user.sendVerificationEmail();

      
  
//       res.json({ message: 'User registered successfully. Check your email for OTP verification.' ,otp:user.otp });
//     } catch (error) {
//       console.error('Error in registerUser:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   };


// const loginUser = async (req, res) => {
//   try {
//     const { username, password, otp } = req.body;
//     const user = await User.findOne({ username });

//     if (!user || !(await user.comparePassword(password)) || user.otp !== otp || user.otpExpiresAt < new Date()) {
//       return res.status(401).json({ error: 'Invalid credentials or expired OTP' });
//     }

//     // OTP is valid, reset it
//     user.otp = null;
//     user.otpExpiresAt = null;
//     await user.save();

    

//     // Add role-specific logic here based on user.role
//     if (user.role === 'coordinator') {
//       const coordinatorClassAttendance = await attendanceService.getCoordinatorClassAttendance(user.class, user.section);
//       // Coordinator-specific actions, e.g., update attendance, retrieve class details, etc.
//       // ...

//       res.json({ message: 'Login successful', role: 'coordinator', data: coordinatorClassAttendance });
//     } else if (user.role === 'dean' || user.role === 'director') {
//       const departmentAttendance = await attendanceService.getDepartmentAttendanceForDate(req.body.selectedDate);
//       // Dean or Director-specific actions, e.g., view department-wide attendance, etc.
//       // ...
//       const token = jwt.sign({ username, role: user.role }, process.env.JWT_SECRET, {
//         expiresIn: '1h', // Set the expiration time as needed
//     });
//     const newUser = new User({...user, token:token})
//       res.json({ message: 'Login successful', role: user.role, data: departmentAttendance , token:newUser.token});
//     } else {
        
//       // Default actions for other roles (if any)
//       res.json({ message: 'Login successful', role: user.role});
//     }
//   } catch (error) {
//     console.error('Error in loginUser:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// module.exports = {
//   loginUser,
//   registerUser
// };




// ---------------------------------------------------------------------------------

// controllers/userController.js
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const attendanceService = require('../services/attendanceService');
const bcrypt = require('bcrypt');

// const registerUser = async (req, res) => {
//   try {
//     const { username, password, role } = req.body;

//     // Validate email before saving
//     if (!username) {
//       return res.status(400).json({ error: 'Email is required' });
//     }

//     // Check if the email is unique
//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.status(400).json({ error: 'Email is already registered' });
//     }

//     const user = new User({ username, password, role });
//     user.generateOTP();
//     await user.save();
//     await user.sendVerificationEmail();

//     const token = jwt.sign({ username, role: user.role }, process.env.JWT_SECRET, {
//       expiresIn: '1h', // Set the expiration time as needed
//     });

//     // Update user with the generated token
//     user.token = token;
//     await user.save();

//     console.log('Registered user:', user);

//     res.json({ message: 'User registered successfully. Check your email for OTP verification.', otp: user.otp, token: user.token });
//   } catch (error) {
//     console.error('Error in registerUser:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

const registerUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Validate email before saving
    if (!username) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if the email is unique
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      // If user already exists, handle it accordingly
      return res.status(400).json({ error: 'Email is already registered' });
    }

    const user = new User({ username, password, role });

    // Ensure the email is unique by catching any potential duplicate key error
    try {
      user.generateOTP();
      await user.save();
      await user.sendVerificationEmail();
    } catch (error) {
      // Check if the error is a duplicate key error
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Email is already registered' });
      }

      // If it's a different error, handle it as a server error
      console.error('Error in registerUser:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const token = jwt.sign({ username, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Set the expiration time as needed
    });

    // Update user with the generated token
    user.token = token;
    await user.save();

    console.log('Registered user:', user);

    res.json({ message: 'User registered successfully. Check your email for OTP verification.', otp: user.otp, token: user.token });
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// const loginUser = async (req, res) => {
//   try {
//     const { username, password, otp } = req.body;
//     const user = await User.findOne({ username });

//     console.log("user:",user);
//     console.log("user:",user);
//     const userPassword = user.password;
//     if (!user || !(await bcrypt.compare(password,userPassword)) || user.otp !== otp || user.otpExpiresAt < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)) {
//       return res.status(401).json({ error: 'Invalid credentials or expired OTP' });
//     }

//     // OTP is valid, reset it
//     user.otp = null;
//     user.otpExpiresAt = null;
//     await user.save();

//     if (user.role === 'coordinator') {
//       const coordinatorClassAttendance = await attendanceService.getCoordinatorClassAttendance(user.class, user.section, req.body.selectedDate);
//       // Coordinator-specific actions, e.g., update attendance, retrieve class details, etc.
//       // ...

//       console.log('Logged in coordinator:', user);

//       res.json({ message: 'Login successful', role: 'coordinator', data: coordinatorClassAttendance, token: user.token });
//     } else if (user.role === 'dean' || user.role === 'director') {
//       const departmentAttendance = await attendanceService.getDepartmentAttendanceForDate(req.body.selectedDate);
//       // Dean or Director-specific actions, e.g., view department-wide attendance, etc.
//       // ...

//       console.log('Logged in dean/director:', user);

//       res.json({ message: 'Login successful', role: user.role, data: departmentAttendance, token: user.token });
//     } else {
//       console.log('Logged in user:', user);

//       res.json({ message: 'Login successful', role: user.role, token: user.token });
//     }
//   } catch (error) {
//     console.error('Error in loginUser:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

const loginUser = async (req, res) => {
	try {
		// Get email and password from request body
		const { username, password , otp} = req.body;

		// Check if email or password is missing
		if (!username || !password || !otp) {
			// Return 400 Bad Request status code with error message
			return res.status(400).json({
				success: false,
				message: `Please Fill up All the Required Fields`,
			});
		}

		// Find user with provided email
		const user = await User.findOne({ username });

		// If user not found with provided email
		if (!user) {
			// Return 401 Unauthorized status code with error message
			return res.status(401).json({
				success: false,
				message: `User is not Registered with Us Please SignUp to Continue`,
			});
		}

		// Generate JWT token and Compare Password
		if (await bcrypt.compare(password, user.password)) {
			const token = jwt.sign(
				{ username: user.username, id: user._id, role: user.role },
				process.env.JWT_SECRET,
				{
					expiresIn: "24h",
				}
			);

			// Save token to user document in database
			user.token = token;
			user.password = undefined;
			// Set cookie for token and return success response
			const options = {
				expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
				httpOnly: true,
			};
			res.cookie("token", token, options).status(200).json({
				success: true,
				token,
				user,
				message: `User Login Success`,
			});
		} else {
			return res.status(401).json({
				success: false,
				message: `Password is incorrect`,
			});
		}
    
	} catch (error) {
		console.error(error);
		// Return 500 Internal Server Error status code with error message
		return res.status(500).json({
			success: false,
			message: `Login Failure Please Try Again`,
		});
	}
};

module.exports = {
  loginUser,
  registerUser,
};
