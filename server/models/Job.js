import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: false
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'],
    default: 'FULL_TIME'
  },
  department: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  salary: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['OPEN', 'CLOSED'],
    default: 'OPEN'
  },
  requirements: [{
    type: String
  }],
  responsibilities: [{
    type: String
  }],
  benefits: [{
    type: String
  }],
  applicationCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  slug: {
    type: String,
    required: false,
    unique: true,
    lowercase: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create slug from role before saving
jobSchema.pre('save', function(next) {
  if (this.isModified('role') || !this.slug) {
    this.slug = this.role
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `job-${Date.now()}`;
  }
  next();
});

export default mongoose.model('Job', jobSchema);
