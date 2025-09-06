// Function to generate HTML for cart reminder email
const cartReminderEmail = (courseName, userName, courseImage, coursePrice, courseLink) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Complete Your Purchase - ${courseName}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          padding: 20px 0;
          background-color: #4f46e5;
          color: white;
          border-radius: 8px 8px 0 0;
        }
        .content {
          padding: 20px;
          background-color: #f9fafb;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
        }
        .course-card {
          display: flex;
          margin: 20px 0;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .course-image {
          width: 120px;
          height: 80px;
          object-fit: cover;
        }
        .course-details {
          padding: 15px;
          flex: 1;
        }
        .course-title {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 5px 0;
        }
        .course-price {
          color: #10b981;
          font-weight: 700;
          font-size: 18px;
          margin: 5px 0;
        }
        .btn {
          display: inline-block;
          padding: 12px 24px;
          background-color: #4f46e5;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 14px;
          color: #6b7280;
          background-color: #f3f4f6;
          border-radius: 0 0 8px 8px;
          border: 1px solid #e5e7eb;
          border-top: none;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Complete Your Purchase</h1>
      </div>
      
      <div class="content">
        <p>Hi ${userName},</p>
        <p>We noticed you were interested in this course but didn't complete your purchase. Don't miss out on this learning opportunity!</p>
        
        <div class="course-card">
          <img src="${courseImage}" alt="${courseName}" class="course-image">
          <div class="course-details">
            <h3 class="course-title">${courseName}</h3>
            <div class="course-price">₹${coursePrice}</div>
          </div>
        </div>
        
        <div style="text-align: center;">
          <a href="${courseLink}" class="btn">Complete Your Purchase Now</a>
        </div>
        
        <p>This special price is only available for a limited time. Complete your purchase now to secure your spot!</p>
        
        <p>If you have any questions, feel free to reply to this email.</p>
        
        <p>Best regards,<br>The SkillUp Team</p>
      </div>
      
      <div class="footer">
        <p>© ${new Date().getFullYear()} SkillUp. All rights reserved.</p>
        <p>If you'd like to unsubscribe from these emails, please <a href="${process.env.FRONTEND_URL}/preferences">update your preferences</a>.</p>
      </div>
    </body>
    </html>
  `;
};

module.exports = cartReminderEmail;
