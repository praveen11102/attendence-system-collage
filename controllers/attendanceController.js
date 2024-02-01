
// --------------------- this code is correct but i wanted some change that's why i wrote below code again - down side
const Attendance = require('../models/attendanceModel');
const User = require('../models/userModel')

// const addAttendance = async (req, res) => {
//   try {
//     const { date, year, department, className, section, totalStrength, beforeLunch, afterLunch } = req.body;

//     // Check if the user has coordinator role
//     if (req.user.role !== 'coordinator') {
//       return res.status(403).json({
//         message: "Permission denied"
//       });
//     }

//     const attendance = await Attendance.create({
//       date,
//       year,
//       department,
//       className,
//       section,
//       totalStrength,
//       beforeLunch,
//       afterLunch,
//     });

//     res.json({ message: 'Attendance added successfully' });
//   } catch (error) {
//     console.error('Error in addAttendance:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

const addAttendance = async (req, res) => {
  try {
    const { date, year, department, className, section, totalStrength, beforeLunch, afterLunch } = req.body;

    // Check if the user has coordinator role
    if (req.user.role !== 'coordinator') {
      return res.status(403).json({
        message: "Permission denied"
      });
    }

    // Associate the coordinator's user ID with the attendance record
    const attendance = await Attendance.create({
      date,
      year,
      department,
      className,
      section,
      totalStrength,
      beforeLunch,
      afterLunch,
      coordinator: req.user.userId, // Associate the coordinator's user ID
    });

    console.log(attendance)

    res.json({ message: 'Attendance added successfully' });
  } catch (error) {
    console.error('Error in addAttendance:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// const getAttendance = async (req, res) => {
//   try {
//     const date = new Date(req.params.date);

//     // For coordinators, restrict access to their own class (or section)
//     const attendanceData = await Attendance.find({
//       date,
//       year: req.user.year,
//       class: req.user.class,
//       section: req.user.section
//     });

//     res.json({success:true , message:"Attendence fetched successfully" ,attendanceData});
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// const getAttendance = async (req, res) => {
//   try {
//     const date = new Date(req.params.date);

//     // For coordinators, get attendance data for all coordinators
//     const allCoordinators = await User.find({ role: 'coordinator' });

//     console.log(allCoordinators)

//     // Initialize an array to store formatted attendance data
//     const formattedAttendance = [];

//     // Iterate through each coordinator and retrieve attendance data
//     for (const coordinator of allCoordinators) {
//       const attendanceData = await Attendance.find({ date, year: coordinator.year, class: coordinator.class, section: coordinator.section });

//       // Format and push the data to the array
//       formattedAttendance.push({
//         coordinator: {
//           userId: coordinator._id,
//           username: coordinator.username,
//           role: coordinator.role,
//           year: coordinator.year,
//           class: coordinator.class,
//           section: coordinator.section,
//         },
//         attendanceRecord: attendanceData,
//       });
//     }

//     res.json({success:true, message:"attendance fetched successfully" , formattedAttendance});
//   } catch (error) {
//     console.error('Error in getAttendance:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// const getAttendance = async (req, res) => {
//   try {
//     const date = new Date(req.params.date);

//     // For coordinators, get attendance data for their specific class and section
//     const user = req.user;

//     if (user.role !== 'coordinator') {
//       return res.status(403).json({ error: 'Permission denied. Only coordinators can view attendance for their class/section.' });
//     }

//     const attendanceData = await Attendance.find({ date, year: user.year, class: user.class, section: user.section });

//     res.json(attendanceData);
//   } catch (error) {
//     console.error('Error in getAttendance:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// const getAttendance = async (req, res) => {
//   try {
//     const date = new Date(req.params.date);

//     // For coordinators, get attendance data for their specific class and section
//     const user = req.user;
//     console.log(user);

//     if (user.role !== 'coordinator') {
//       return res.status(403).json({ error: 'Permission denied. Only coordinators can view attendance for their class/section.' });
//     }

//     // Adjust the query to include the coordinator's user ID
//     const attendanceData = await Attendance.find({ date, year: user.year, class: user.class, section: user.section, coordinator: user.userId });

//     res.json(attendanceData);
//   } catch (error) {
//     console.error('Error in getAttendance:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };



const getAttendance = async (req, res) => {
  try {
    // Extract parameters from the request query
    const { date, year, className, section } = req.query;

    // Validate date parameter
    const parsedDate = date ? new Date(date) : null;
    if (date && isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format.' });
    }

    // For coordinators, get attendance data for their specific class and section
    const user = req.user;

    if (!user || user.role !== 'coordinator') {
      return res.status(403).json({ error: 'Permission denied. Only coordinators can view attendance for their class/section.' });
    }

    // Create an object to represent the conditions
    const conditions = {};

    // Add conditions only if the parameters are present
    if (parsedDate) {
      conditions.date = parsedDate;
    }
    if (className) {
      conditions.className = className;
    }
    if (section) {
      conditions.section = section;
    }
    if (year) {
      conditions.year = year;
    }

    // Add coordinator-specific condition to filter by coordinator's user ID
    conditions.coordinatorId = user._id;

    // Adjust the query to include the coordinator's user ID
    const attendanceData = await Attendance.find(conditions);

    res.json(attendanceData);
  } catch (error) {
    console.error('Error in getAttendance:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAttendance,
};



const updateAttendance = async (req, res) => {
  try {
    const { date, year, department, class: className, section, beforeLunch, afterLunch, totalStrength } = req.body;

    // Check if the user has coordinator role and matches class/section
    if (req.user.role !== 'coordinator' || req.user.year !== year || req.user.class !== className || req.user.section !== section) {
      return res.status(403).json({ error: 'Permission denied. Only coordinators can update attendance for their own class/section.' });
    }

    let attendanceRecord = await Attendance.findOne({
      date,
      year,
      department,
      class: className,
      section
    });

    if (!attendanceRecord) {
      attendanceRecord = new Attendance({
        date,
        year,
        department,
        class: className,
        section,
        beforeLunch,
        afterLunch,
        totalStrength,
      });
    } else {
      attendanceRecord.beforeLunch = beforeLunch;
      attendanceRecord.afterLunch = afterLunch;
      attendanceRecord.totalStrength = totalStrength;
    }

    await attendanceRecord.save();
    res.json({ message: 'Attendance updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const attendanceId = req.params.id;
    let attendanceRecord = await Attendance.findById(attendanceId);

    // Check if the user has coordinator role and matches class/section
    if (!attendanceRecord || req.user.role !== 'coordinator' || req.user.year !== attendanceRecord.year || req.user.class !== attendanceRecord.class || req.user.section !== attendanceRecord.section) {
      return res.status(403).json({ error: 'Permission denied. Only coordinators can delete attendance for their own class/section.' });
    }

    await Attendance.findByIdAndDelete(attendanceId);
    res.json({ message: 'Attendance deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const viewAllDepartmentsAttendance = async (req, res) => {
  try {
    // Check if the user has dean or director role
    if (req.user.role !== 'dean' && req.user.role !== 'director') {
      return res.status(403).json({ error: 'Permission denied. Only deans and directors can view all department attendance.' });
    }

    // Fetch all department-wise attendance
    const allDepartmentsAttendance = await Attendance.find({}).sort({ date: 'asc' });
    res.json(allDepartmentsAttendance);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const viewAndUpdateAttendance = async (req, res) => {
  try {
    // Check if the user has dean or director role
    if (req.user.role !== 'dean' && req.user.role !== 'director') {
      return res.status(403).json({ error: 'Permission denied. Only deans and directors can view and update department attendance.' });
    }

    const { date, department } = req.body;

    // Fetch department-wise attendance for the given date
    const departmentAttendance = await Attendance.find({ date, department }).sort({ class: 'asc', section: 'asc' });
    res.json(departmentAttendance);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  addAttendance,
  getAttendance,
  updateAttendance,
  deleteAttendance,
  viewAllDepartmentsAttendance,
  viewAndUpdateAttendance,
};


// const Attendance = require('../models/attendanceModel');

// const addAttendance = async (req, res) => {
//   try {
//     const { date, year, department, className, section, totalStrength, beforeLunch, afterLunch } = req.body;

//     const { role } = req.user;

//     if (role !== 'coordinator') {
//       return res.status(403).json({
//         message: "Permission denied"
//       });
//     }

//     const attendance = await Attendance.create({
//       date,
//       year,
//       department,
//       className,
//       section,
//       totalStrength,
//       beforeLunch,
//       afterLunch
//     });

//     res.json({ message: 'Attendance added successfully' });
//   } catch (error) {
//     console.error('Error in addAttendance:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// const getAttendance = async (req, res) => {
//   try {
//     const date = new Date(req.params.date);

//     const { year, class: className, section } = req.user;

//     const attendanceData = await Attendance.find({ date, year, class: className, section });
//     res.json(attendanceData);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// const updateAttendance = async (req, res) => {
//   try {
//     const { date, year, department, class: className, section, beforeLunch, afterLunch, totalStrength } = req.body;

//     const { role, year: userYear, class: userClass, section: userSection } = req.user;

//     if (role !== 'coordinator' || userYear !== year || userClass !== className || userSection !== section) {
//       return res.status(403).json({ error: 'Permission denied. Only coordinators can update attendance for their own class/section.' });
//     }

//     let attendanceRecord = await Attendance.findOne({ date, year, department, class: className, section });

//     if (!attendanceRecord) {
//       attendanceRecord = new Attendance({
//         date,
//         year,
//         department,
//         class: className,
//         section,
//         beforeLunch,
//         afterLunch,
//         totalStrength,
//       });
//     } else {
//       attendanceRecord.beforeLunch = beforeLunch;
//       attendanceRecord.afterLunch = afterLunch;
//       attendanceRecord.totalStrength = totalStrength;
//     }

//     await attendanceRecord.save();
//     res.json({ message: 'Attendance updated successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// const deleteAttendance = async (req, res) => {
//   try {
//     const attendanceId = req.params.id;
//     let attendanceRecord = await Attendance.findById(attendanceId);

//     const { role, year, class: userClass, section: userSection } = req.user;

//     if (!attendanceRecord || role !== 'coordinator' || year !== attendanceRecord.year || userClass !== attendanceRecord.class || userSection !== attendanceRecord.section) {
//       return res.status(403).json({ error: 'Permission denied. Only coordinators can delete attendance for their own class/section.' });
//     }

//     await Attendance.findByIdAndDelete(attendanceId);
//     res.json({ message: 'Attendance deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// const viewAllDepartmentsAttendance = async (req, res) => {
//   try {
//     const { role } = req.user;

//     if (role !== 'dean' && role !== 'director') {
//       return res.status(403).json({ error: 'Permission denied. Only deans and directors can view all department attendance.' });
//     }

//     const allDepartmentsAttendance = await Attendance.find({}).sort({ date: 'asc' });
//     res.json(allDepartmentsAttendance);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// const viewAndUpdateAttendance = async (req, res) => {
//   try {
//     const { role } = req.user;

//     if (role !== 'dean' && role !== 'director') {
//       return res.status(403).json({ error: 'Permission denied. Only deans and directors can view and update department attendance.' });
//     }

//     const { date, department } = req.body;

//     const departmentAttendance = await Attendance.find({ date, department }).sort({ class: 'asc', section: 'asc' });
//     res.json(departmentAttendance);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// module.exports = {
//   addAttendance,
//   getAttendance,
//   updateAttendance,
//   deleteAttendance,
//   viewAllDepartmentsAttendance,
//   viewAndUpdateAttendance,
// };
