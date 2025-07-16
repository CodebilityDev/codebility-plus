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
		\tCodev ID: ${codev_id}
		\tFirst Name: ${codev_first_name} 
		\tLast Name: ${codev_last_name} 
		\tPosition: ${codev_display_position}
		`.trim()
	)
}

export const HTMLTemplate = ({ from_name, from_email, message, codev_id, codev_first_name, codev_last_name, codev_display_position }) => {
	return (
		`
    <html>
			<head>
				<style>
					body {
						font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
						background-color: #f4f4f4;
						margin: 0;
						padding: 0;
					}
					.container {
						max-width: 600px;
						margin: 20px auto;
						background-color: #ffffff;
						padding: 30px;
						border-radius: 8px;
						box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
					}
					.header {
						border-bottom: 2px solid #e0e0e0;
						padding-bottom: 20px;
						margin-bottom: 25px;
						text-align: center;
					}
					.header h1 {
						margin: 0;
						color: #0052cc;
						font-size: 28px;
						font-weight: 700;
					}
					h3 {
						margin: 0 0 15px 0;
						color: #333333;
						font-size: 20px;
						font-weight: 600;
					}
					p, td {
						font-size: 16px;
						line-height: 1.6;
						color: #333333;
					}
					.sender-info {
						background-color: #f8f9fa;
						padding: 20px;
						border-radius: 6px;
						margin-bottom: 25px;
						border: 1px solid #e0e0e0;
					}
					.sender-info p {
						margin: 8px 0;
					}
					.sender-info a {
						color: #0052cc;
						text-decoration: none;
					}
					.sender-info a:hover {
						text-decoration: underline;
					}
					.message {
						background-color: #f9fcff;
						padding: 20px;
						border-left: 4px solid #0052cc;
						margin-bottom: 25px;
						border-radius: 4px;
					}
					.codev-info {
						background-color: #f8f9fa;
						padding: 20px;
						border-radius: 6px;
						border: 1px solid #e0e0e0;
					}
					.codev-info table {
						width: 100%;
						border-collapse: collapse;
					}
					.codev-info td {
						padding: 10px 0;
						border-bottom: 1px solid #e0e0e0;
					}
					.codev-info td:first-child {
						font-weight: 600;
						width: 35%;
						color: #333333;
					}
					.footer {
						margin-top: 30px;
						padding-top: 20px;
						border-top: 2px solid #e0e0e0;
						color: #666666;
						font-size: 14px;
						text-align: center;
					}
					.footer a {
						color: #0052cc;
						text-decoration: none;
					}
					.footer a:hover {
						text-decoration: underline;
					}
				</style>
			</head>
			<body>
				<div class="container">
					<div class="header">
						<h1>New Message from ${from_name}</h1>
					</div>
					
					<div class="sender-info">
						<p><strong>Name:</strong> ${from_name}</p>
						<p><strong>Email:</strong> <a href="mailto:${from_email}">${from_email}</a></p>
					</div>
					
					<div class="message">
						<h3>Message</h3>
						<p>${message}</p>
					</div>
					
					<div class="codev-info">
						<h3>${from_name} wants to hire ${codev_first_name} ${codev_last_name}</h3>
						<table>
							<tr>
								<td>Codev ID:</td>
								<td>${codev_id}</td>
							</tr>
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
				</div>
			</body>
		</html>
		`
	);
};
