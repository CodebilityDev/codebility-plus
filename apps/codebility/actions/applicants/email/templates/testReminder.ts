import { EMAIL_STYLES } from "../config";

export const getTestReminderTextTemplate = (name?: string) => `
Dear ${name ? name : "Applicant"},

IMPORTANT: If you have already completed your application or received this email before, please disregard this message.

This is a friendly reminder to complete your application process with Codebility.

⏰ DEADLINE REMINDER: You have 5 days from the date of your application to complete the test. Please take action soon!

Steps to complete your application:
1. Visit and Sign In to our website: https://www.codebility.tech/auth/sign-in
2. Once Signed In, Click on "Status" in the navigation menu
3. Click "Take the Test" button
4. Read the instructions carefully
5. Complete and submit your test

We're excited to see your progress and look forward to your submission.

If you have any questions, please contact us at Codebility.dev@gmail.com

Best regards,
The Codebility Team

Website: https://www.codebility.tech/
Facebook: https://www.facebook.com/Codebilitydev
LinkedIn: https://www.linkedin.com/company/codebilitytech/
`.trim();

export const getTestReminderHtmlTemplate = (name?: string) => `
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
        <strong>Important:</strong> If you have already completed your application or received this email before, please disregard this message.
    </div>

    <div class="content">
        <p>Dear ${name ? name : "Applicant"},</p>

        <p>This is a friendly reminder to complete your application process with Codebility.</p>

        <div class="disclaimer" style="background-color: #fff3cd; border: 2px solid #ff9800; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <strong>⏰ DEADLINE REMINDER:</strong> You have <strong>5 days</strong> from the date of your application to complete the test. Please take action soon!
        </div>

        <div class="steps">
            <h3>Steps to complete your application:</h3>
            <ol>
                <li>Visit and Sign in to our website: <a href="https://www.codebility.tech/auth/sign-in">https://www.codebility.tech/auth/sign-in</a></li>
                <li>Once Signed In, Click on "Status" in the navigation menu</li>
                <li>Click "Take the Test" button</li>
                <li>Read the instructions carefully</li>
                <li>Complete and submit your test</li>
            </ol>
        </div>

        <p>We're excited to see your progress and look forward to your submission.</p>

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
