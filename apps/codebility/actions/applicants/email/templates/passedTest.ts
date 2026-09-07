import { EMAIL_STYLES } from "../config";

export const getPassedTestTextTemplate = (
  name?: string,
  waitListLink?: string,
  discordLink?: string
) => `
Dear ${name ? name : "Applicant"},
Congratulations for passing the Assessment!

We are thrilled to inform you that you have successfully completed the assessment with Codebility.
For now, please visit our website and check the status of your application.

Steps to check your application status:
1. Visit and Sign In our website: https://www.codebility.tech/auth/sign-in
2. Once Signed In, Click on "Status" in the navigation menu
3. Click the Join Waiting List and Join Discord Server

or

join our Discord Server here: ${discordLink} and once you joined,
check the #lobby and message us your full-name - position - years of exp - Onboarding i.e. Juan Dela Cruz - Frontend - 2.4 - Onboarding.
join our Waiting List here: ${waitListLink}, to get updates on your application status.

We're excited to see your progress with Codebility and look forward to your onboarding.

If you have any questions, please contact us at Codebility.dev@gmail.com

Best regards,
The Codebility Team

Website: https://www.codebility.tech/
Facebook: https://www.facebook.com/Codebilitydev
LinkedIn: https://www.linkedin.com/company/codebilitytech/
`.trim();

export const getPassedTestHtmlTemplate = (
  name?: string,
  waitListLink?: string,
  discordLink?: string
) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
${EMAIL_STYLES}
.congratulations {
background-color: #d4edda;
border: 1px solid #c3e6cb;
padding: 15px;
margin-bottom: 20px;
border-radius: 5px;
}
</style>
</head>
<body>
<div class="congratulations">
<strong>🎉 Congratulations!</strong> You have successfully passed the assessment!
</div>

<div class="content">
<p>Dear ${name ? name : "Applicant"},</p>

<p>We are thrilled to inform you that you have successfully completed the assessment with Codebility.</p>
<p>For now, please visit our website and check the status of your application.</p>

<div class="steps">
<h3>Steps to check your application status:</h3>
<ol>
<li>Visit and Sign In our website: <a href="https://www.codebility.tech/auth/sign-in">https://www.codebility.tech/auth/sign-in</a></li>
<li>Once Signed In, Click on "Status" in the navigation menu</li>
<li>Click the Join Waiting List and Join Discord Server</li>
</ol>

<p><strong>or</strong></p>

<p>Join our Discord Server here: <a href="${discordLink}">Discord</a> and once you joined,
check the #lobby and message us your full-name - position - years of exp - Onboarding i.e. Juan Dela Cruz - Frontend - 2.4 - Onboarding.</p>

<p>Join our Waiting List here: <a href="${waitListLink}">Wait List</a>, to get updates on your application status.</p>
</div>

<p>We're excited to see your progress with Codebility and look forward to your onboarding.</p>

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
