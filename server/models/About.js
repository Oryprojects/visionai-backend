import mongoose from 'mongoose';

const directorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  designation: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String
  },
  image: {
    type: String
  },
  linkedin: {
    type: String
  },
  email: {
    type: String
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const aboutSchema = new mongoose.Schema({
  companyInfo: {
    mission: {
      type: String,
      required: true
    },
    vision: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    foundedYear: {
      type: Number
    },
    teamSize: {
      type: String
    },
    headquarters: {
      type: String
    }
  },
  contactInfo: {
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    mapUrl: {
      type: String
    }
  },
  directors: [directorSchema],
  stats: {
    projectsCompleted: {
      type: Number,
      default: 0
    },
    clientsServed: {
      type: Number,
      default: 0
    },
    yearsExperience: {
      type: Number,
      default: 0
    },
    teamMembers: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

export default mongoose.model('About', aboutSchema);
