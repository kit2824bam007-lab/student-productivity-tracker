const axios = require('axios');

const getLeetCodeStats = async (username) => {
  try {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          profile {
            reputation
            ranking
          }
        }
        userContestRanking(username: $username) {
          attendedContestsCount
          rating
          globalRanking
          totalParticipants
        }
      }
    `;

    const response = await axios.post('https://leetcode.com/graphql', {
      query,
      variables: { username }
    });

    const data = response.data.data;
    
    if (!data.matchedUser) {
      throw new Error('User not found');
    }

    const solved = data.matchedUser.submitStats.acSubmissionNum.find(
      item => item.difficulty === 'All'
    ).count;

    return {
      problemsSolved: solved,
      ranking: data.matchedUser.profile.ranking,
      contestRating: data.userContestRanking ? data.userContestRanking.rating : 0,
      contestsAttended: data.userContestRanking ? data.userContestRanking.attendedContestsCount : 0
    };
  } catch (error) {
    console.error('Error fetching LeetCode data:', error);
    throw new Error('Could not fetch LeetCode data');
  }
};

module.exports = { getLeetCodeStats };