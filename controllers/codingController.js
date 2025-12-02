const Student = require('../models/Student');
const { getLeetCodeStats } = require('../utils/leetcode');
const { getCodeChefStats } = require('../utils/codechef');

// Add or update coding profile
const addCodingProfile = async (req, res) => {
  try {
    const { platform, username } = req.body;

    const student = await Student.findOne({ user: req.user._id });
    
    // Check if profile for this platform already exists
    const existingIndex = student.codingProfiles.findIndex(profile => profile.platform === platform);
    
    let profileData;
    try {
      // Fetch data from the coding platform
      if (platform === 'leetcode') {
        profileData = await getLeetCodeStats(username);
      } else if (platform === 'codechef') {
        profileData = await getCodeChefStats(username);
      } else {
        return res.status(400).json({ message: 'Unsupported platform' });
      }
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }

    const profile = {
      platform,
      username,
      problemsSolved: profileData.problemsSolved,
      currentStreak: 0, // Would need additional logic to track streaks
      rating: profileData.rating || profileData.contestRating || 0,
      rank: profileData.rank || profileData.stars || profileData.globalRank || 'Unranked',
      lastUpdated: new Date()
    };

    if (existingIndex !== -1) {
      // Update existing profile
      student.codingProfiles[existingIndex] = profile;
    } else {
      // Add new profile
      student.codingProfiles.push(profile);
    }

    await student.save();

    res.status(200).json({ message: 'Coding profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get coding profile
const getCodingProfile = async (req, res) => {
  try {
    const { platform } = req.params;

    const student = await Student.findOne({ user: req.user._id });
    const profile = student.codingProfiles.find(p => p.platform === platform);
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addCodingProfile, getCodingProfile };