exports.courseEnrollmentEmail = (courseName, name) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Welcome to ${courseName} | SkillUp</title>
        <style>
            body {
                background-color: #f5f7fa;
                font-family: 'Arial', sans-serif;
                font-size: 16px;
                line-height: 1.6;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 30px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
    
            .header {
                text-align: center;
                padding-bottom: 20px;
                border-bottom: 1px solid #eeeeee;
                margin-bottom: 30px;
            }
    
            .logo {
                max-width: 180px;
                margin-bottom: 20px;
            }
    
            .message {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 25px;
                color: #2c3e50;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 25px;
                text-align: left;
            }
    
            .cta {
                display: inline-block;
                padding: 12px 30px;
                background-color: #4361ee;
                color: #ffffff;
                text-decoration: none;
                border-radius: 30px;
                font-size: 16px;
                font-weight: bold;
                margin: 20px 0;
                transition: all 0.3s ease;
            }
    
            .cta:hover {
                background-color: #3a56d4;
                transform: translateY(-2px);
            }
    
            .video-container {
                margin: 25px 0;
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                text-align: center;
            }
    
            .video-thumbnail {
                width: 100%;
                border-radius: 6px;
                margin-bottom: 10px;
            }
    
            .highlight {
                font-weight: bold;
                color: #4361ee;
            }
    
            .support {
                font-size: 14px;
                color: #7f8c8d;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eeeeee;
                text-align: center;
            }
    
            .signature {
                margin-top: 25px;
                font-style: italic;
                color: #2c3e50;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
            <div class="header">
                <a href="https://skillup.com"><img class="logo" src="https://i.imgur.com/yNj2n3B.png" alt="SkillUp Logo"></a>
                <div class="message">Welcome to ${courseName}!</div>
            </div>
            
            <div class="body">
                <p>Dear ${name},</p>
                
                <p>Congratulations on taking the first step toward mastering new skills! You're now officially enrolled in <span class="highlight">${courseName}</span> at SkillUp.</p>
                
                <p>We've prepared a special welcome video to help you get started:</p>
                
                <div class="video-container">
                    <a href="https://skillup.com/courses/${courseName.replace(/ /g, '-')}/welcome">
                        <img class="video-thumbnail" src="https://i.imgur.com/JqYeZRn.jpg" alt="Welcome to ${courseName}">
                    </a>
                    <p><a href="https://skillup.com/courses/${courseName.replace(/ /g, '-')}/welcome">Watch your welcome video</a></p>
                </div>
                
                <p>Here's what you can expect:</p>
                <ul>
                    <li>Access to premium learning materials</li>
                    <li>Interactive exercises and projects</li>
                    <li>Certificate upon completion</li>
                    <li>24/7 support from our team</li>
                </ul>
                
                <p>Your learning adventure begins now! Visit your dashboard to access all course materials and start your first lesson.</p>
                
                <center>
                    <a class="cta" href="https://skillup.com/dashboard">Go to My Dashboard</a>
                </center>
                
                <div class="signature">
                    <p>Happy learning,</p>
                    <p>The SkillUp Team</p>
                </div>
            </div>
            
            <div class="support">
                Need help? Our support team is available 24/7 at <a href="mailto:support@skillup.com">support@skillup.com</a><br>
                or call us at +1 (800) 555-LEARN.
            </div>
        </div>
    </body>
    
    </html>`;
};