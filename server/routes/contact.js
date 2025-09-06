const express = require("express");
const router = express.Router();
const { 
  contactUsController, 
  getAllContactMessages, 
  updateMessageStatus 
} = require("../controllers/ContactUs");
const { auth, isAdmin } = require("../middlewares/auth");

// Public route - anyone can submit a contact form
router.post("/contact", contactUsController);

// Protected Admin routes
router.get("/admin/messages", auth, isAdmin, getAllContactMessages);
router.put("/admin/messages/:messageId/status", auth, isAdmin, updateMessageStatus);

module.exports = router;
