import { EMAIL_STYLES } from "../config";

export const getAcceptedTextTemplate = (name?: string) => `
Dear ${name ? name : "Applicant"},

🎉 Congratulations! We are thrilled to inform you that you have been ACCEPTED to join Codebility!

After carefully reviewing your onboarding performance, quiz results, and commitment, we are excited to welcome you to our developer community.

NEXT STEPS - IMPORTANT:

You can now access the Codebility platform:
1. Visit and sign in: https://www.codebility.tech/auth/sign-in
2. Once signed in, you'll have full access to /home where you can:
   - View your dashboard
   - Access projects
   - Connect with your team
   - Start earning points through our gamification system

WHAT TO EXPECT:

✓ You'll be assigned to your first project soon
✓ You'll meet your team members and mentor
✓ You'll start tracking your progress and earning points
✓ You'll participate in twice-weekly meetings as committed

IMPORTANT REMINDERS:

• Remember your commitment: 3-6 months minimum, twice weekly meetings
• Stay active on Discord - check #announcements and #general regularly
• Be proactive in communication with your team and mentor
• Track your time and deliverables accurately

We're excited to have you on board and can't wait to see the amazing work you'll do!

Welcome to the Codebility family! 🚀

If you have any questions, please contact us at Codebility.dev@gmail.com

Best regards,
The Codebility Team

Website: https://www.codebility.tech/
Facebook: https://www.facebook.com/Codebilitydev
LinkedIn: https://www.linkedin.com/company/codebilitytech/
`.trim();

export const getAcceptedHtmlTemplate = (name?: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        ${EMAIL_STYLES}
        .celebration {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            margin-bottom: 20px;
            border-radius: 10px;
            text-align: center;
        }
        .celebration h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
        }
        .next-steps {
            background-color: #e3f2fd;
            border-left: 4px solid #2196f3;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .important-box {
            background-color: #fff3cd;
            border: 2px solid #ffc107;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .access-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
        }
        ul {
            list-style-type: none;
            padding-left: 0;
        }
        ul li:before {
            content: "✓ ";
            color: #4caf50;
            font-weight: bold;
            margin-right: 10px;
        }
    </style>
</head>
<body>
    <div class="celebration">
        <h1>🎉 CONGRATULATIONS! 🎉</h1>
        <p style="font-size: 18px; margin: 0;">You've Been Accepted to Codebility!</p>
    </div>

    <div class="content">
        <p>Dear ${name ? name : "Applicant"},</p>

        <p>We are thrilled to inform you that after carefully reviewing your onboarding performance, quiz results, and commitment, <strong>you have been ACCEPTED</strong> to join Codebility!</p>

        <div class="next-steps">
            <h3 style="margin-top: 0; color: #1976d2;">🚀 Access the Platform Now</h3>
            <p>You can now access the full Codebility platform:</p>
            <ol>
                <li>Visit and sign in: <a href="https://www.codebility.tech/auth/sign-in">https://www.codebility.tech/auth/sign-in</a></li>
                <li>Once signed in, navigate to <strong>/home</strong> to access your dashboard</li>
                <li>Explore projects, connect with your team, and start earning points!</li>
            </ol>
            <div style="text-align: center; margin: 20px 0;">
                <a href="https://www.codebility.tech/auth/sign-in" class="access-button">
                    Access Platform →
                </a>
            </div>
        </div>

        <h3>What You'll Find at /home:</h3>
        <ul>
            <li>Your personalized dashboard</li>
            <li>Project assignments and tasks</li>
            <li>Team member connections</li>
            <li>Gamification system with points and achievements</li>
            <li>Progress tracking and milestones</li>
        </ul>

        <div class="important-box">
            <h3 style="margin-top: 0;">⚠️ Important Reminders:</h3>
            <ul style="list-style-type: disc; padding-left: 20px;">
                <li style="margin-bottom: 8px;"><strong>Commitment:</strong> 3-6 months minimum, twice weekly meetings</li>
                <li style="margin-bottom: 8px;"><strong>Discord:</strong> Stay active and check #announcements and #general regularly</li>
                <li style="margin-bottom: 8px;"><strong>Communication:</strong> Be proactive with your team and mentor</li>
                <li style="margin-bottom: 8px;"><strong>Tracking:</strong> Log your time and deliverables accurately</li>
            </ul>
        </div>

        <p>We're excited to have you on board and can't wait to see the amazing work you'll do!</p>

        <p><strong>Welcome to the Codebility family! 🚀</strong></p>

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
