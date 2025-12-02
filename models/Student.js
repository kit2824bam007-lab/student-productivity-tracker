const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: String,
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
});

const certificateSchema = new mongoose.Schema({
  name: String,
  issuedBy: String,
  issueDate: Date,
  credentialUrl: String
});

const eventSchema = new mongoose.Schema({
  name: String,
  type: {
    type: String,
    enum: ['contest', 'hackathon', 'workshop', 'webinar']
  },
  participationDate: Date,
  role: String,
  result: String
});

const codingProfileSchema = new mongoose.Schema({
  platform: {
    type: String,
    enum: ['leetcode', 'codechef', 'hackerrank', 'other']
  },
  username: String,
  problemsSolved: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  rating: Number,
  rank: String,
  lastUpdated: Date
});

const mobileUsageSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  totalScreenTime: Number, // in minutes
  productiveTime: Number, // in minutes
  productivityScore: Number // percentage
});

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  avatar: String,
  joinDate: {
    type: Date,
    default: Date.now
  },
  courses: [courseSchema],
  certificates: [certificateSchema],
  events: [eventSchema],
  codingProfiles: [codingProfileSchema],
  mobileUsage: [mobileUsageSchema],
  overallProductivity: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  rank: Number,
  lastActive: Date
});

// Update the overall productivity based on mobile usage
studentSchema.methods.updateProductivity = function() {
  if (this.mobileUsage.length === 0) {
    this.overallProductivity = 0;
    return;
  }
  
  const recentUsage = this.mobileUsage.slice(-7); // Last 7 days
  const totalProductive = recentUsage.reduce((sum, day) => sum + day.productiveTime, 0);
  const totalScreenTime = recentUsage.reduce((sum, day) => sum + day.totalScreenTime, 0);
  
  this.overallProductivity = totalScreenTime > 0 ? Math.round((totalProductive / totalScreenTime) * 100) : 0;
};

module.exports = mongoose.model('Student', studentSchema);