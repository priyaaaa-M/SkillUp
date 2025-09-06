const { instance } = require("../config/razorpay")
const Course = require("../models/Course")
const crypto = require("crypto")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const mongoose = require("mongoose")
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail")
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")
const CourseProgress = require("../models/CourseProgress")

// Capture the payment and initiate the Razorpay order
const capturePayment = async (req, res) => {
  const { courses } = req.body
  const userId = req.user.id
  if (courses.length === 0) {
    return res.json({ success: false, message: "Please Provide Course ID" })
  }

  let total_amount = 0

  for (const course_id of courses) {
    let course
    try {
      // Find the course by its ID
      course = await Course.findById(course_id)

      // If the course is not found, return an error
      if (!course) {
        return res
          .status(200)
          .json({ success: false, message: "Could not find the Course" })
      }

      // Check if the user is already enrolled in the course
      const uid = new mongoose.Types.ObjectId(userId)
      if (course.studentsEnroled.includes(uid)) {
        return res
          .status(200)
          .json({ success: false, message: "Student is already Enrolled" })
      }

      // Add the price of the course to the total amount
      total_amount += course.price
    } catch (error) {
      console.log(error)
      return res.status(500).json({ success: false, message: error.message })
    }
  }

  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  }

  try {
    // Get Razorpay key from environment variables
    const razorpayKey = process.env.RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      throw new Error("Razorpay key not configured in environment variables");
    }

    // Initiate the payment using Razorpay
    const paymentResponse = await instance.orders.create(options)
    console.log('Payment response:', paymentResponse)
    
    // Include the Razorpay key in the response
    res.json({
      success: true,
      data: {
        ...paymentResponse,
        key_id: process.env.RAZORPAY_KEY_ID // Add the Razorpay key to the response
      },
    })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: "Could not initiate order." })
  }
}

// verify the payment
const verifyPayment = async (req, res) => {
  try {
    console.log('Verifying payment with data:', req.body);
    
    const razorpay_order_id = req.body?.razorpay_order_id
    const razorpay_payment_id = req.body?.razorpay_payment_id
    const razorpay_signature = req.body?.razorpay_signature
    const courses = req.body?.courses
    const userId = req.user?.id

    console.log('Verification data:', {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature: razorpay_signature ? 'present' : 'missing',
      courses,
      userId
    });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
      console.error('Missing required fields for payment verification');
      return res.status(400).json({ 
        success: false, 
        message: "Payment verification failed: Missing required fields",
        details: {
          razorpay_order_id: !!razorpay_order_id,
          razorpay_payment_id: !!razorpay_payment_id,
          razorpay_signature: !!razorpay_signature,
          courses: !!courses,
          userId: !!userId
        }
      });
    }

    let body = `${razorpay_order_id}|${razorpay_payment_id}`;
    console.log('Generating signature for:', body);

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    console.log('Generated signature:', expectedSignature);
    console.log('Received signature:', razorpay_signature);
    console.log('Signatures match:', expectedSignature === razorpay_signature);

    if (expectedSignature === razorpay_signature) {
      console.log('Signature verified, enrolling student...');
      try {
        await enrollStudents(courses, userId);
        return res.status(200).json({ 
          success: true, 
          message: "Payment Verified" 
        });
      } catch (error) {
        console.error('Error in enrollStudents:', error);
        return res.status(500).json({
          success: false,
          message: "Payment verified but enrollment failed",
          error: error.message
        });
      }
    } else {
      console.error('Signature verification failed');
      return res.status(400).json({ 
        success: false, 
        message: "Payment verification failed: Invalid signature" 
      });
    }
  } catch (error) {
    console.error('Error in verifyPayment:', error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error during payment verification" 
    });
  }
}

// Track cart abandonment
const trackCartAbandonment = async (req, res) => {
  try {
    const { courseId, courseName, price, thumbnail } = req.body;
    const userId = req.user.id;

    // Update user's abandoned cart info
    const user = await User.findByIdAndUpdate(userId, {
      $set: {
        abandonedCart: {
          items: [{
            courseId,
            courseName,
            price,
            thumbnail,
            addedAt: new Date()
          }],
          lastUpdated: new Date(),
          reminderSent: false
        }
      }
    }, { new: true });

    // Schedule a reminder email after 1 hour
    setTimeout(async () => {
      try {
        const updatedUser = await User.findById(userId);
        if (updatedUser.abandonedCart && !updatedUser.abandonedCart.reminderSent) {
          // Import the cart reminder utility
          const { sendCartReminderEmail } = require('../utils/cartReminder');
          await sendCartReminderEmail(updatedUser, updatedUser.abandonedCart.items[0]);
          
          // Mark reminder as sent
          updatedUser.abandonedCart.reminderSent = true;
          await updatedUser.save();
        }
      } catch (error) {
        console.error('Error sending cart reminder:', error);
      }
    }, 60 * 60 * 1000); // 1 hour delay

    return res.status(200).json({
      success: true,
      message: 'Cart abandonment tracked successfully'
    });
  } catch (error) {
    console.error('Error in trackCartAbandonment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to track cart abandonment',
      error: error.message
    });
  }
};

// Send Payment Success Email
const sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body

  const userId = req.user.id

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" })
  }

  try {
    const enrolledStudent = await User.findById(userId)

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    )
  } catch (error) {
    console.log("error in sending mail", error)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
}

// enroll the student in the courses
const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    throw new Error("Course ID and User ID are required");
  }

  for (const courseId of courses) {
    try {
      // Find the course, enroll the student, and increment enrollment count
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { 
          $push: { studentsEnroled: userId },
          $inc: { enrollmentCount: 1 } // Increment enrollment count
        },
        { new: true }
      )

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, error: "Course not found" })
      }
      console.log("Updated course: ", enrolledCourse)

      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      })
      // Find the student and add the course to their list of enrolled courses
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      )

      console.log("Enrolled student: ", enrolledStudent)
      // Send an email notification to the enrolled student
      console.log("Sending enrollment email...")
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      )
      console.log("Email send successfully")

      console.log("Email sent successfully: ", emailResponse.response)
    } catch (error) {
      console.log(error)
      return res.status(400).json({ success: false, error: error.message })
    }
  }
}

module.exports = {
  capturePayment,
  verifyPayment,
  sendPaymentSuccessEmail,
  enrollStudents,
  trackCartAbandonment,
};