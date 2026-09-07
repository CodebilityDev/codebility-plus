import { EMAIL_STYLES } from "../config";

export const getFailedTestTextTemplate = (name?: string) => `
Dear ${name ? name : "Applicant"},
Thank you for taking the time to complete the assessment with Codebility.

We regret to inform you that you did not pass the assessment.

We encourage you to continue honing your skills and consider reapplying in the future.

You can check the date on when you can reapply again by visiting our website and checking the status of your application.

If you have any questions, please contact us at Codebility.dev@gmail.com

Best regards,
The Codebility Team

Website: https://www.codebility.tech/
Facebook: https://www.facebook.com/Codebilitydev
LinkedIn: https://www.linkedin.com/company/codebilitytech/
`.trim();

export const getFailedTestHtmlTemplate = (name?: string) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
${EMAIL_STYLES}
.result {
background-color: #f8d7da;
border: 1px solid #f5c6cb;
padding: 15px;
margin-bottom: 20px;
border-radius: 5px;
}
</style>
</head>
<body>
<div class="result">
<strong>Test Result:</strong> We regret to inform you that you did not pass the assessment.
</div>

<div class="content">
<p>Dear ${name ? name : "Applicant"},</p>

<p>Thank you for taking the time to complete the assessment with Codebility.</p>

<p>We encourage you to continue honing your skills and consider reapplying in the future.</p>

<p>You can check the date on when you can reapply again by visiting our website and checking the status of your application.</p>

<p>If you have any questions, please contact us at <a href="mailto:Codebility.dev@gmail.com">Codebility.dev@gmail.com</a></p>
</div>

<div class="footer">
<p><strong>Best regards,</strong><br>
The Codebility Team</p>
<div class="logo-container">
<img src="https://codebility.tech/assets/images/codebility.png" alt="Codebility Logo" class="logo">
</div>
<p>
<a href="https://www.codebility.tech/">Website</a> |
<a href="https://www.facebook.com/Codebilitydev">Facebook</a> |
<a href="https://www.linkedin.com/company/codebilitytech/">LinkedIn</a>
</p>
</div>
</body>
</html>
`;
