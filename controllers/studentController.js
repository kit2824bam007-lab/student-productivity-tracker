const Student = require('../models/Student');
const Course = require('../models/Course');

// Get student dashboard
const getDashboard = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Calculate productivity for the last 7 days
    const recentUsage = student.mobileUsage.slice(-7);
    const productivityData = recentUsage.map(day => ({
      date: day.date,
      productivity: day.productivityScore
    }));

    res.status(200).json({
      student,
      productivityData,
      courses: student.courses,
      certificates: student.certificates,
      events: student.events,
      codingProfiles: student.codingProfiles
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add mobile usage data
const addMobileUsage = async (req, res) => {
  try {
    const { date, totalScreenTime, productiveTime } = req.body;
    const productivityScore = Math.round((productiveTime / totalScreenTime) * 100);

    const student = await Student.findOne({ user: req.user._id });
    
    // Check if entry for this date already exists
    const existingIndex = student.mobileUsage.findIndex(entry => 
      new Date(entry.date).toDateString() === new Date(date).toDateString()
    );

    if (existingIndex !== -1) {
      // Update existing entry
      student.mobileUsage[existingIndex] = {
        date,
        totalScreenTime,
        productiveTime,
        productivityScore
      };
    } else {
      // Add new entry
      student.mobileUsage.push({
        date,
        totalScreenTime,
        productiveTime,
        productivityScore
      });
    }

    // Update overall productivity
    student.updateProductivity();
    await student.save();

    res.status(200).json({ message: 'Mobile usage data added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register for a course
const registerCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const student = await Student.findOne({ user: req.user._id });
    
    // Check if already registered
    const isRegistered = student.courses.some(c => c._id.toString() === courseId);
    if (isRegistered) {
      return res.status(400).json({ message: 'Already registered for this course' });
    }

    // Add to student's courses
    student.courses.push({
      name: course.name,
      progress: 0
    });

    // Add student to course's enrolled list
    course.studentsEnrolled.push(student._id);
    
    await student.save();
    await course.save();

    res.status(200).json({ message: 'Course registration successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update course progress
const updateCourseProgress = async (req, res) => {
  try {
    const { courseId, progress } = req.body;

    const student = await Student.findOne({ user: req.user._id });
    const course = student.courses.id(courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.progress = progress;
    await student.save();

    res.status(200).json({ message: 'Course progress updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add certificate
const addCertificate = async (req, res) => {
  try {
    const { name, issuedBy, issueDate, credentialUrl } = req.body;

    const student = await Student.findOne({ user: req.user._id });
    student.certificates.push({
      name,
      issuedBy,
      issueDate,
      credentialUrl
    });

    await student.save();

    res.status(200).json({ message: 'Certificate added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add event participation
const addEvent = async (req, res) => {
  try {
    const { name, type, participationDate, role, result } = req.body;

    const student = await Student.findOne({ user: req.user._id });
    student.events.push({
      name,
      type,
      participationDate,
      role,
      result
    });

    await student.save();

    res.status(200).json({ message: 'Event added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboard,
  addMobileUsage,
  registerCourse,
  updateCourseProgress,
  addCertificate,
  addEvent
};