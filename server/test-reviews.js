const axios = require('axios');
require('dotenv').config();

async function testReviewsEndpoint() {
  try {
    const BASE_URL = process.env.BASE_URL || 'http://localhost:4000/api/v1';
    const url = `${BASE_URL}/course/getAllReviews`;
    
    console.log(`Testing endpoint: ${url}`);
    
    const response = await axios.get(url);
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      const reviews = response.data.reviews || [];
      console.log(`Found ${reviews.length} reviews`);
      if (reviews.length > 0) {
        console.log('Sample review:', {
          id: reviews[0]._id,
          user: reviews[0].user,
          course: reviews[0].course,
          rating: reviews[0].rating,
          review: reviews[0].review
        });
      }
    }
  } catch (error) {
    console.error('Error testing endpoint:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
}

testReviewsEndpoint();
