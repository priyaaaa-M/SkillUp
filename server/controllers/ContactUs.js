const { contactUsEmail } = require("../mail/templates/contactFormRes");
const mailSender = require("../utils/mailSender");
const Contact = require("../models/Contact");

exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } = req.body;
  
  try {
    // Save to database
    const contact = await Contact.create({
      email,
      firstname,
      lastname,
      message,
      phoneNo: phoneNo || "",
      countrycode: countrycode || "",
    });

    // Send confirmation email
    const emailRes = await mailSender(
      email,
      "Thank you for contacting us!",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    );

    console.log("Message saved and email sent:", contact._id);
    
    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully!",
      data: contact
    });
  } catch (error) {
    console.error("Error in contact form submission:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
      error: error.message
    });
  }
};

// Admin: Get all contact form submissions
exports.getAllContactMessages = async (req, res) => {
  try {
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages"
    });
  }
};

// Admin: Update message status
exports.updateMessageStatus = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { status } = req.body;

    const updatedMessage = await Contact.findByIdAndUpdate(
      messageId,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({
        success: false,
        message: "Message not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedMessage
    });
  } catch (error) {
    console.error("Error updating message status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update message status"
    });
  }
};
