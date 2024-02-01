// // models/Attendance.js
// const mongoose = require('mongoose');

// const attendanceSchema = new mongoose.Schema({
//   date: { type: Date, required: true },
//   year: { type: Number, required: true },
//   department: { type: String, required: true },
//   class: { type: String, required: true },
//   section: { type: String, required: true },
//   totalStrength: { type: Number, required: true }, // Add totalStrength field
//   beforeLunch: { type: Number, required: true },
//   afterLunch: { type: Number, required: true },
// });

// const Attendance = mongoose.model('Attendance', attendanceSchema);

// // module.exports = Attendance;

// const mongoose = require('mongoose');

// const attendanceSchema = new mongoose.Schema({
//   date: { type: Date, required: true },
//   year: { type: Number, required: true },
//   department: { type: String, required: true },
//   className: { type: String, required: true },
//   section: { type: String, required: true },
//   totalStrength: { type: Number, required: true },
//   beforeLunch: { type: Number, required: true },
//   afterLunch: { type: Number, required: true },
// });

// const Attendance = mongoose.model('Attendance', attendanceSchema);

// module.exports = Attendance;

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  year: { enum:["1","2","3","4"] },
  department: { type: String, required: true },
  className: { type: String, required: true },
  section: { type: String, required: true },
  totalStrength: { type: Number, required: true },
  beforeLunch: { type: Number, required: true },
  afterLunch: { type: Number, required: true },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;