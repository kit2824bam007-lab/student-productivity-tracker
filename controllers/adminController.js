const Student = require('../models/Student');
const User = require('../models/User');

// Get all students with ranking
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('user', 'email')
      .sort({ overallProductivity: -1 });
    
    // Update ranks based on productivity
    for (let i = 0; i < students.length; i++) {
      students[i].rank = i + 1;
      await students[i].save();
    }

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get overall statistics
const getStatistics = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalCourses = await Student.aggregate([
      { $unwind: '$courses' },
      { $count: 'totalCourses' }
    ]);
    
    const avgProductivity = await Student.aggregate([
      { $group: { _id: null, avg: { $avg: '$overallProductivity' } } }
    ]);

    const codingStats = await Student.aggregate([
      { $unwind: '$codingProfiles' },
      { $group: {
        _id: '$codingProfiles.platform',
        avgProblems: { $avg: '$codingProfiles.problemsSolved' },
        avgRating: { $avg: '$codingProfiles.rating' }
      }}
    ]);

    res.status(200).json({
      totalStudents,
      totalCourses: totalCourses[0]?.totalCourses || 0,
      avgProductivity: avgProductivity[0]?.avg || 0,
      codingStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get student performance prediction (simplified AI)
const getPerformancePrediction = async (req, res) => {
  try {
    const { id } = req.params;
    
    const student = await Student.findById(id).populate('user', 'email');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Simple prediction algorithm based on current performance trends
    const recentProductivity = student.mobileUsage.slice(-7).map(day => day.productivityScore);
    const avgRecentProductivity = recentProductivity.reduce((a, b) => a + b, 0) / recentProductivity.length;
    
    const trend = recentProductivity.length > 1 ? 
      (recentProductivity[recentProductivity.length - 1] - recentProductivity[0]) / recentProductivity.length : 0;
    
    const predictedProductivity = Math.min(100, Math.max(0, avgRecentProductivity + (trend * 7)));
    
    // Course completion prediction
    const avgCourseProgress = student.courses.reduce((sum, course) => sum + course.progress, 0) / student.courses.length;
    const predictedCourseCompletion = student.courses.map(course => ({
      name: course.name,
      predictedCompletion: course.progress < 100 ? 
        new Date(Date.now() + ((100 - course.progress) * 24 * 60 * 60 * 1000 / avgCourseProgress)) : 
        'Completed'
    }));

    res.status(200).json({
      student: student.name,
      currentProductivity: student.overallProductivity,
      predictedProductivity: Math.round(predictedProductivity),
      trend: trend > 0 ? 'improving' : trend < 0 ? 'declining' : 'stable',
      predictedCourseCompletion
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllStudents, getStatistics, getPerformancePrediction };