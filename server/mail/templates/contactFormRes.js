exports.contactUsEmail = (email, firstname, lastname, message, phoneNo, countrycode) => {
  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>Contact Form Confirmation</title>
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
          background-color: #4f46e5;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          padding: 20px;
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-top: none;
          border-radius: 0 0 8px 8px;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Thank You for Contacting Us!</h1>
      </div>
      <div class="content">
        <p>Hello ${firstname} ${lastname},</p>
        
        <p>Thank you for reaching out to us. We have received your message and our team will get back to you as soon as possible.</p>
        
        <h3>Your Message Details:</h3>
        <p><strong>Email:</strong> ${email}</p>
        ${phoneNo ? `<p><strong>Phone:</strong> ${countrycode || ''} ${phoneNo}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        
        <p>We appreciate your patience and will respond to your inquiry shortly.</p>
        
        <p>Best regards,<br>The SkillUp Team</p>
      </div>
      <div class="footer">
        <p>This is an automated message. Please do not reply to this email.</p>
      </div>
    </body>
  </html>`;
};
