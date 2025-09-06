module.exports = (userName, amount, orderId, date) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Payment Successful - SkillUp</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background: #ffffff;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                padding: 10px 0;
                border-bottom: 1px solid #e0e0e0;
            }
            .content {
                padding: 20px 0;
            }
            .footer {
                text-align: center;
                padding: 10px 0;
                border-top: 1px solid #e0e0e0;
                font-size: 12px;
                color: #777;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #4CAF50;
                color: white !important;
                text-decoration: none;
                border-radius: 4px;
                margin: 15px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header" style="text-align: center; padding: 20px 0; border-bottom: 1px solid #e0e0e0;">
                <a href="https://skillup-edtech-project.vercel.app" style="display: inline-block; margin-bottom: 15px;">
                    <img src="https://i.ibb.co/7Xyj3PC/logo.png" alt="SkillUp Logo" style="max-width: 180px; height: auto;">
                </a>
                <h2 style="margin: 10px 0 0; color: #2c3e50; font-size: 24px;">Payment Successful! 🎉</h2>
            </div>
            <div class="content">
                <p>Dear ${userName},</p>
                <p>Thank you for your payment of <strong>₹${amount}</strong> for your order <strong>#${orderId}</strong> on ${new Date(date).toLocaleDateString()}.</p>
                <p>Your payment has been successfully processed.</p>
                <p>You can now access your course materials by logging into your account.</p>
                <div style="text-align: center;">
                    <a href="http://localhost:3000/dashboard/enrolled-courses" class="button">Go to My Courses</a>
                </div>
                <p>If you have any questions about your order, please contact our support team at <a href="mailto:support@skillup.com" style="color: #4CAF50; text-decoration: none;">support@skillup.com</a>.</p>
                
                <div class="footer" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #777; font-size: 14px;">
                    <p>© ${new Date().getFullYear()} SkillUp. All rights reserved.</p>
                    <p>123 Learning Street, Education City, 100001</p>
                    <p>
                        <a href="https://skillup-edtech-project.vercel.app" style="color: #4CAF50; text-decoration: none; margin: 0 10px;">Website</a> | 
                        <a href="#" style="color: #4CAF50; text-decoration: none; margin: 0 10px;">Privacy Policy</a> | 
                        <a href="#" style="color: #4CAF50; text-decoration: none; margin: 0 10px;">Terms of Service</a>
                    </p>
                </div>
                
                <p style="margin-top: 30px;">Best regards,<br><strong>The SkillUp Team</strong></p>
            </div>
            <div class="footer">
                <p>© ${new Date().getFullYear()} SkillUp. All rights reserved.</p>
                <p>This is an automated message, please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};
