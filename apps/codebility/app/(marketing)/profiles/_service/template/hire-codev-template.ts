import React from 'react';

export const TextTemplate = ({ from_name, from_email, message, codev_id, codev_first_name, codev_last_name, codev_display_position }) => {
	return (
		`
		New Message from ${from_name}

		Sender Information:
		\tName: ${from_name}
		\tEmail: ${from_email}

		Message: ${message}

		Hiring Details: ${from_name} wants to hire ${codev_first_name} ${codev_last_name}
		\tFirst Name: ${codev_first_name} 
		\tLast Name: ${codev_last_name} 
		\tPosition: ${codev_display_position}
		`.trim()
	)
}

export const HTMLTemplate = ({ from_name, from_email, message, codev_id, codev_first_name, codev_last_name, codev_display_position }) => {
	return (
		`
    <!DOCTYPE html>
		<html lang="en">
		<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>New Hire Request - Codebility</title>
				<style>
						body {
								font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
								background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
								margin: 0;
								padding: 0;
								color: #1a202c;
								line-height: 1.6;
						}
						
						.container {
								max-width: 600px;
								margin: 0 auto;
								padding: 40px 20px;
						}
						
						.email-card {
								background: #ffffff;
								border: 1px solid #e2e8f0;
								border-radius: 16px;
								padding: 40px;
								box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
						}
						
						.logo {
								text-align: center;
								margin-bottom: 30px;
						}
						
						.logo h1 {
								font-size: 32px;
								font-weight: 700;
								margin: 0;
								background: linear-gradient(45deg, #0ea5e9, #10b981);
								-webkit-background-clip: text;
								-webkit-text-fill-color: transparent;
								background-clip: text;
								letter-spacing: -0.02em;
								color: #0ea5e9; /* Fallback */
						}
						
						.logo .tagline {
								font-size: 14px;
								color: #64748b;
								margin-top: 8px;
								text-transform: uppercase;
								letter-spacing: 0.1em;
						}
						
						.welcome-text {
								text-align: center;
								margin-bottom: 30px;
						}
						
						.welcome-text h2 {
								font-size: 24px;
								font-weight: 600;
								margin: 0 0 16px 0;
								color: #1a202c;
						}
						
						.welcome-text p {
								font-size: 16px;
								color: #4a5568;
								margin: 0;
						}
						
						.sender-info {
								background: #f0f9ff;
								border: 1px solid #bae6fd;
								border-radius: 12px;
								padding: 24px;
								margin: 30px 0;
						}
						
						.sender-info p {
								font-size: 15px;
								color: #374151;
								margin: 8px 0;
						}
						
						.sender-info a {
								color: #0ea5e9;
								text-decoration: none;
						}
						
						.sender-info a:hover {
								text-decoration: underline;
						}
						
						.message-section {
								background: #f8fafc;
								border: 1px solid #e2e8f0;
								border-radius: 12px;
								padding: 24px;
								margin: 30px 0;
						}
						
						.message-section h3 {
								font-size: 18px;
								color: #1a202c;
								margin: 0 0 16px 0;
								font-weight: 600;
						}
						
						.message-section p {
								font-size: 15px;
								color: #374151;
								margin: 0;
						}
						
						.codev-info {
								background: #f0f9ff;
								border: 1px solid #bae6fd;
								border-radius: 12px;
								padding: 24px;
								margin: 30px 0;
						}
						
						.codev-info h3 {
								font-size: 18px;
								color: #1a202c;
								margin: 0 0 16px 0;
								font-weight: 600;
						}
						
						.codev-info table {
								width: 100%;
								border-collapse: collapse;
						}
						
						.codev-info td {
								padding: 10px 0;
								border-bottom: 1px solid #e2e8f0;
								font-size: 15px;
								color: #374151;
						}
						
						.codev-info td:first-child {
								font-weight: 600;
								width: 35%;
								color: #1a202c;
						}
						
						.footer {
								text-align: center;
								margin-top: 40px;
								padding-top: 20px;
								border-top: 1px solid #e2e8f0;
						}
						
						.footer p {
								font-size: 14px;
								color: #64748b;
								margin: 8px 0;
						}
						
						.footer a {
								color: #0ea5e9;
								text-decoration: none;
						}
						
						/* Email client compatibility fixes */
						table {
								border-collapse: collapse;
								mso-table-lspace: 0pt;
								mso-table-rspace: 0pt;
						}
						
						.outlook-fallback {
								display: none;
						}
						
						.gmail-fix {
								font-size: 0;
								line-height: 0;
								height: 0;
								overflow: hidden;
						}
						
						@media (max-width: 600px) {
								.container {
										padding: 20px 10px;
								}
								
								.email-card {
										padding: 24px;
								}
								
								.logo h1 {
										font-size: 28px;
								}
								
								.welcome-text h2 {
										font-size: 20px;
								}
						}
						
						@media (prefers-color-scheme: dark) {
								.email-card {
										background: #ffffff !important;
										color: #1a202c !important;
								}
								
								.welcome-text h2 {
										color: #1a202c !important;
								}
								
								.codev-info h3, .message-section h3 {
										color: #1a202c !important;
								}
						}
				</style>
		</head>
		<body>
				<div class="container">
						<div class="email-card">
								<div class="logo">
										<h1>Codebility</h1>
										<div class="tagline">Where Code Meets Community</div>
								</div>
								
								<div class="welcome-text">
										<h2>New Hire Request from ${from_name}</h2>
										<p>${from_name} is interested in hiring ${codev_first_name} ${codev_last_name} for your team.</p>
								</div>
								
								<div class="sender-info">
										<p><strong>Name:</strong> ${from_name}</p>
										<p><strong>Email:</strong> <a href="mailto:${from_email}">${from_email}</a></p>
								</div>
								
								<div class="message-section">
										<h3>Message</h3>
										<p>${message}</p>
								</div>
								
								<div class="codev-info">
										<h3>Hire Details</h3>
										<table>
												<tr>
														<td>First Name:</td>
														<td>${codev_first_name}</td>
												</tr>
												<tr>
														<td>Last Name:</td>
														<td>${codev_last_name}</td>
												</tr>
												<tr>
														<td>Position:</td>
														<td>${codev_display_position}</td>
												</tr>
										</table>
								</div>
								
								<div class="footer">
										<p>© 2025 Codebility. Built with ❤️ for developers.</p>
								</div>
						</div>
				</div>
		</body>
		</html>
		`
	);
};
