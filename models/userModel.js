const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const transporter = require('../config/email');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['coordinator', 'dean', 'director'], required: true },
  otp: { type: String },
  otpExpiresAt: { type: Date },
  token:{type:String , default:null},
  class: { type: String }, // Add this line for class information
  section: { type: String },
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
  next();
});

userSchema.methods.generateOTP = function () {
  const user = this;
  user.otp = randomstring.generate({ length: 6, charset: 'numeric' });
  user.otpExpiresAt = new Date(Date.now() + 600000); // OTP expires in 10 minutes
};

userSchema.methods.sendVerificationEmail = async function () {
  const user = this;

  const mailOptions = {
    from: 'killerpraveen11102@gmail.com',
    to: user.username,
    subject: 'OTP Verification',
    text: `Your OTP for registration is: ${user.otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP sent to', user.username);
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Error sending OTP');
  }
};


const User = mongoose.model('User', userSchema);

module.exports = User;
