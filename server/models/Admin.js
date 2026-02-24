import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['ADMIN'],
    default: 'ADMIN'
  },
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: {
    type: String,
    select: false
  },
  twoFactorOTP: {
    type: String,
    select: false
  },
  twoFactorOTPExpires: {
    type: Date,
    select: false
  }
}, {
  timestamps: true
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate OTP method
adminSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.twoFactorOTP = otp;
  this.twoFactorOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return this.save({ validateBeforeSave: false });
};

// Verify OTP method
adminSchema.methods.verifyOTP = function(candidateOTP) {
  // Ensure OTP fields are available
  if (!this.twoFactorOTP || !this.twoFactorOTPExpires) {
    return false;
  }
  
  // Check if OTP has expired
  if (Date.now() > this.twoFactorOTPExpires.getTime()) {
    return false;
  }
  
  // Compare OTPs
  const isValid = this.twoFactorOTP === candidateOTP;
  
  if (isValid) {
    // Clear OTP fields after successful verification (but don't save here)
    this.twoFactorOTP = undefined;
    this.twoFactorOTPExpires = undefined;
  }
  
  return isValid;
};

// Remove password from JSON output
adminSchema.methods.toJSON = function() {
  const admin = this.toObject();
  delete admin.password;
  return admin;
};

export default mongoose.model('Admin', adminSchema);
