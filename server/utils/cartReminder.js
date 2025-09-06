const User = require("../models/User");
const mailSender = require("./mailSender");
const cartReminderEmail = require("../mail/templates/cartReminderEmail");

// Track cart abandonment
const trackCartAbandonment = async (userId, courseDetails) => {
    try {
        // Store the abandoned cart info in the user's document
        await User.findByIdAndUpdate(userId, {
            $set: {
                abandonedCart: {
                    items: courseDetails,
                    lastUpdated: Date.now()
                }
            }
        });
    } catch (error) {
        console.error("Error tracking cart abandonment:", error);
    }
};

// Send cart reminder email
const sendCartReminderEmail = async (user, courseDetails) => {
    try {
        const emailContent = cartReminderEmail(
      courseDetails.courseName,
      user.firstName,
      courseDetails.thumbnail,
      courseDetails.price,
      `${process.env.FRONTEND_URL}/course-details/${courseDetails.courseId}`
    );

        await mailSender(
            user.email,
            `Don't Miss Out on ${courseDetails.courseName}!`,
            emailContent
        );
        
        console.log(`Cart reminder email sent to ${user.email}`);
    } catch (error) {
        console.error("Error sending cart reminder email:", error);
    }
};

// Check for abandoned carts and send reminders
const checkAbandonedCarts = async () => {
    try {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
        
        const usersWithAbandonedCarts = await User.find({
            'abandonedCart.lastUpdated': { $lt: oneHourAgo },
            'abandonedCart.reminderSent': { $ne: true }
        });

        for (const user of usersWithAbandonedCarts) {
            await sendCartReminderEmail(user, user.abandonedCart.items[0]);
            
            // Mark reminder as sent
            user.abandonedCart.reminderSent = true;
            await user.save();
        }
    } catch (error) {
        console.error("Error checking abandoned carts:", error);
    }
};

module.exports = {
    trackCartAbandonment,
    sendCartReminderEmail,
    checkAbandonedCarts
};
