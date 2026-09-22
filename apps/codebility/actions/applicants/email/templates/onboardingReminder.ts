import { EMAIL_STYLES } from "../config";

export const getOnboardingReminderTextTemplate = (
  name?: string,
  waitListLink?: string,
  discordLink?: string
) => `
Dear ${name ? name : "Applicant"},
IMPORTANT: If you have already received this email before or checked the onboarding, please disregard this message.

This is a friendly reminder to complete your onboarding process with Codebility.

Steps to complete your onboarding:
1. Visit and Sign in to our website: https://www.codebility.tech/auth/sign-in
2. Once Sign in, Click on "Status" in the navigation menu
3. Click the Join Waiting List and Join Discord Server

or

join our Discord Server here: ${discordLink} and once you joined,
check the #lobby and messege us your full-name - position - years of exp - Onboarding i.e. Juan Dela Cruz - Frontend - 2.4 - Onboarding.

join our Waiting List here: ${waitListLink}, to get updates on your application status.

We're excited to see your progress with Codebility and look forward to your onboarding.

If you have any questions, please contact us at Codebility.dev@gmail.com

Best regards,
The Codebility Team

Website: https://www.codebility.tech/
Facebook: https://www.facebook.com/Codebilitydev
LinkedIn: https://www.linkedin.com/company/codebilitytech/
`.trim();

export const getOnboardingReminderHtmlTemplate = (
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
</style>
</head>
<body>
<div class="disclaimer">
<strong>Important:</strong> If you have already received this email before or checked the onboarding, please disregard this message.
</div>

<div class="content">
<p>Dear ${name ? name : "Applicant"},</p>

<p>This is a friendly reminder to complete your onboarding process with Codebility.</p>

<div class="steps">
<h3>Steps to complete your onboarding:</h3>
<ol>
    <li>Visit and Sign in to our website: <a href="https://www.codebility.tech/auth/sign-in">https://www.codebility.tech/auth/sign-in</a></li>
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
