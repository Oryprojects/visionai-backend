import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE'
  },
  featured: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ''
  },
  slug: {
    type: String,
    required: false,
    unique: true,
    lowercase: true
  },
  category: {
    type: String,
    required: true
  },
  features: [{
    type: String
  }]
}, {
  timestamps: true
});

// Create slug from title before saving
serviceSchema.pre('save', function(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `service-${Date.now()}`;
  }
  next();
});

export default mongoose.model('Service', serviceSchema);
