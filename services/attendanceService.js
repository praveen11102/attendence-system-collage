const Attendance = require('../models/attendanceModel');

const getCoordinatorClassAttendance = async (coordinatorClass, coordinatorSection, date) => {
  try {
    const attendanceDetails = await Attendance.findOne({ class: coordinatorClass, section: coordinatorSection, date });
    return attendanceDetails;
  } catch (error) {
    console.error('Error in getCoordinatorClassAttendance:', error);
    throw error;
  }
};

const getDepartmentAttendanceForDate = async (selectedDate) => {
  try {
    const departmentAttendance = await Attendance.find({ date: selectedDate });
    return departmentAttendance;
  } catch (error) {
    console.error('Error in getDepartmentAttendanceForDate:', error);
    throw error;
  }
};

module.exports = { getCoordinatorClassAttendance, getDepartmentAttendanceForDate };
