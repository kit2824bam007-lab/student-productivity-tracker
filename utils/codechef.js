const axios = require('axios');
const cheerio = require('cheerio');

const getCodeChefStats = async (username) => {
  try {
    const response = await axios.get(`https://www.codechef.com/users/${username}`);
    const $ = cheerio.load(response.data);

    // Extract problems solved
    const problemsSolvedText = $('h5:contains("Fully Solved")').text();
    const problemsSolved = parseInt(problemsSolvedText.replace('Fully Solved (', '').replace(')', '')) || 0;

    // Extract rating
    const ratingText = $('.rating-number').text();
    const rating = parseInt(ratingText) || 0;

    // Extract stars (rank)
    const starsText = $('.rating-star').text();
    const stars = starsText.length;

    // Extract global rank
    const rankElements = $('ul.inline-list li a[href*="ratings/all"]');
    let globalRank = 0;
    
    if (rankElements.length > 0) {
      const rankText = rankElements.first().text().replace('#', '').replace(',', '');
      globalRank = parseInt(rankText) || 0;
    }

    return {
      problemsSolved,
      rating,
      stars,
      globalRank
    };
  } catch (error) {
    console.error('Error fetching CodeChef data:', error);
    throw new Error('Could not fetch CodeChef data');
  }
};

module.exports = { getCodeChefStats };