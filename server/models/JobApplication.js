import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 20,
  },
  position: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  message: {
    type: String,
    trim: true,
    maxlength: 2000,
  },
  resumeFilename: {
    type: String,
    required: true,
  },
  resumePath: {
    type: String,
    // resumePath may be empty when using memory uploads (e.g., serverless environments)
    required: false,
  },
  status: {
    type: String,
    enum: ['submitted', 'reviewing', 'interview', 'rejected', 'hired'],
    default: 'submitted',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
jobApplicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

export default JobApplication;