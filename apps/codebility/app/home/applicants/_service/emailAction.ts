"use server";

import { createClientServerComponent } from "@/utils/supabase/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    service: "gmail",
    secure: true, // true for port 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER, // Move credentials to environment variables
        pass: process.env.EMAIL_APP_PASSWORD, // Use App Password, not regular password
    },
});

export const sendMultipleTestReminderEmail = async (emails: string[]) => {
    try {
        // Send individual emails instead of bulk to avoid spam detection
        for (const email of emails) {
            const mailOptions = {
                from: `"Codebility Team" <${process.env.EMAIL_USER}>`,
                to: email, // Single recipient
                replyTo: 'Codebility.dev@gmail.com',
                headers: {
                    'X-Priority': '3',
                    'X-MSMail-Priority': 'Normal',
                    'X-Mailer': 'Codebility Application System',
                },
                subject: "Application Reminder - Codebility",
                // Plain text version (important for spam filters)
                text: `
                Dear Applicant,

                IMPORTANT: If you have already completed your application or received this email before, please disregard this message.

                This is a friendly reminder to complete your application process with Codebility.

                Steps to complete your application:
                1. Visit our website: https://www.codebility.tech/
                2. Click on "Status" in the navigation menu
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
                `.trim(),
                // Simplified HTML version with header and footer
                html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .disclaimer {
                            background-color: #fff3cd;
                            border: 1px solid #ffeaa7;
                            padding: 15px;
                            margin-bottom: 20px;
                            border-radius: 5px;
                        }
                        .content {
                            margin: 20px 0;
                        }
                        .steps {
                            background-color: #f9f9f9;
                            padding: 15px;
                            border-radius: 5px;
                            margin: 15px 0;
                        }
                        .footer {
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 1px solid #eee;
                            font-size: 14px;
                            color: #666;
                        }
                        a {
                            color: #007bff;
                            text-decoration: none;
                        }
                        a:hover {
                            text-decoration: underline;
                        }
                        .logo {
                            max-width: 150px;
                            height: auto;
                            margin: 20px 0;
                        }
                        .logo-container {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            padding: 10px;
                            border-radius: 5px;
                            max-width: 150px;
                            display: flex;
                            justify-content: center;
                            items: center;
                        }
                    </style>
                </head>
                <body>
                    <div class="disclaimer">
                        <strong>Important:</strong> If you have already completed your application or received this email before, please disregard this message.
                    </div>
                    
                    <div class="content">
                        <p>Dear Applicant,</p>
                        
                        <p>This is a friendly reminder to complete your application process with Codebility.</p>
                        
                        <div class="steps">
                            <h3>Steps to complete your application:</h3>
                            <ol>
                                <li>Visit our website: <a href="https://www.codebility.tech/">https://www.codebility.tech/</a></li>
                                <li>Click on "Status" in the navigation menu</li>
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
                `,
            };

            await transporter.sendMail(mailOptions);
            console.log(`Email sent successfully to: ${email}`);
            
            // Add delay between emails to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
        }
        
        console.log("All emails sent successfully to:", emails);
    } catch (error) {
        console.error("Error sending emails:", error);
        throw new Error("Failed to send emails");
    }
}