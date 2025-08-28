const otpTemplate = (otp) => {
	return `<!DOCTYPE html>
	<html>
	
	<head>
		<meta charset="UTF-8">
		<title>Your SkillUp Verification Code</title>
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
				margin-bottom: 25px;
			}
	
			.logo {
				max-width: 180px;
				margin-bottom: 15px;
			}
	
			.message {
				font-size: 22px;
				font-weight: bold;
				margin-bottom: 20px;
				color: #2c3e50;
			}
	
			.body {
				font-size: 16px;
				margin-bottom: 25px;
				text-align: left;
			}
	
			.otp-container {
				margin: 25px 0;
				padding: 15px;
				background-color: #f8f9fa;
				border-radius: 8px;
				text-align: center;
			}
	
			.otp {
				font-size: 32px;
				font-weight: bold;
				letter-spacing: 5px;
				color: #4361ee;
				margin: 10px 0;
			}
	
			.note {
				font-size: 14px;
				color: #7f8c8d;
				margin-top: 20px;
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
				<div class="message">Your Verification Code</div>
			</div>
			
			<div class="body">
				<p>Hello there,</p>
				
				<p>Thank you for joining SkillUp! To ensure the security of your account, please use the following One-Time Password (OTP) to complete your verification:</p>
				
				<div class="otp-container">
					<p>Your SkillUp verification code is:</p>
					<div class="otp">${otp}</div>
					<p>This code will expire in <strong>5 minutes</strong>.</p>
				</div>
				
				<p>For your security, please:</p>
				<ul>
					<li>Never share this code with anyone</li>
					<li>Use it only on the official SkillUp website</li>
					<li>Complete your verification promptly</li>
				</ul>
				
				<div class="note">
					<strong>Note:</strong> If you didn't request this code, please ignore this email or contact our support team immediately.
				</div>
				
				<div class="signature">
					<p>Happy learning,</p>
					<p>Priyanka<br>Customer Success Team<br>SkillUp</p>
				</div>
			</div>
			
			<div class="support">
				Need help? Contact us at <a href="mailto:support@skillup.com">support@skillup.com</a> or call +1 (800) 555-LEARN.<br>
				We're available 24/7 to assist you.
			</div>
		</div>
	</body>
	
	</html>`;
};
module.exports = otpTemplate;