require('dotenv').config();
const mongoose = require('mongoose');
const RatingAndReview = require('./models/RatingAndReview');

async function testEndpoint() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');

    // Count total reviews
    const count = await RatingAndReview.countDocuments();
    console.log('Total reviews in database:', count);

    if (count > 0) {
      // Get a sample review
      const sample = await RatingAndReview.findOne()
        .populate('user', 'firstName lastName email')
        .populate('course', 'courseName');
      
      console.log('Sample review:', {
        user: sample.user,
        course: sample.course,
        rating: sample.rating,
        review: sample.review,
        createdAt: sample.createdAt
      });
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

testEndpoint();
