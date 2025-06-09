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
        const mailOptions = {
            from: "Codebility Team",
            bcc: emails, // Use BCC for mass sending
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

        console.log("All emails sent successfully to:", emails);
    } catch (error) {
        console.error("Error sending emails:", error);
        throw new Error("Failed to send emails");
    }
}


export const sendTestReminder = async ({ email, name }: { email: string, name: string }) => {
    try {
        const mailOptions = {
            from: "Codebility Team",
            to: email, // Single recipient
            replyTo: 'Codebility.dev@gmail.com',
            headers: {
                'X-Priority': '3',
                'X-MSMail-Priority': 'Normal',
                'X-Mailer': 'Codebility Application System',
            },
            subject: "Application Reminder - Codebility",
            text: `
                Dear ${name},

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
                          <p>Dear ${name},</p>
                          
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
        }

        await transporter.sendMail(mailOptions);
        console.log(`Test reminder email sent successfully to: ${email}`);
    } catch (error) {
        console.error("Error sending test reminder:", error);
        throw new Error("Failed to send test reminder");
    }
}


export const sendMultipleOnboardingReminder = async (emails: string[]) => {
    try {
        const waitListLink = process.env.NEXT_PUBLIC_MESSENGER_WAITLIST
        const discordLink = process.env.NEXT_PUBLIC_DISCORD_LINK

        const mailOptions = {
            from: "Codebility Team",
            bcc: emails, // Use BCC for mass sending
            replyTo: 'Codebility.dev@gmail.com',
            headers: {
            'X-Priority': '3',
            'X-MSMail-Priority': 'Normal',
            'X-Mailer': 'Codebility Application System',
            },
            subject: "Onboarding Reminder - Codebility",
            text: `
            Dear Applicant,
            IMPORTANT: If you have already received this email before or checked the onboarding, please disregard this message.

            This is a friendly reminder to complete your onboarding process with Codebility.

            Steps to complete your onboarding:
            1. Visit our website: https://www.codebility.tech/
            2. Click on "Status" in the navigation menu
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
            `.trim(),
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
            <strong>Important:</strong> If you have already received this email before or checked the onboarding, please disregard this message.
            </div>
            
            <div class="content">
            <p>Dear Applicant,</p>
            
            <p>This is a friendly reminder to complete your onboarding process with Codebility.</p>
            
            <div class="steps">
            <h3>Steps to complete your onboarding:</h3>
            <ol>
                <li>Visit our website: <a href="https://www.codebility.tech/">https://www.codebility.tech/</a></li>
                <li>Click on "Status" in the navigation menu</li>
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
            `,
        }

        await transporter.sendMail(mailOptions);
        console.log("Onboarding reminder emails sent successfully to:", emails);
    } catch (error) {
        console.error("Error sending onboarding reminder emails:", error);
        throw new Error("Failed to send onboarding reminder emails");
    }
}

export const sendOnboardingReminder = async ({ email, name }: { email: string, name: string }) => {
    try {
        const waitListLink = process.env.NEXT_PUBLIC_MESSENGER_WAITLIST
        const discordLink = process.env.NEXT_PUBLIC_DISCORD_LINK

        const mailOptions = {
            from: "Codebility Team",
            to: email, // Single recipient
            replyTo: 'Codebility.dev@gmail.com',
            headers: {
                'X-Priority': '3',
                'X-MSMail-Priority': 'Normal',
                'X-Mailer': 'Codebility Application System',
            },
            subject: "Onboarding Reminder - Codebility",
            text: `
            Dear ${name},
            IMPORTANT: If you have already received this email before or checked the onboarding, please disregard this message.

            This is a friendly reminder to complete your onboarding process with Codebility.

            Steps to complete your onboarding:
            1. Visit our website: https://www.codebility.tech/
            2. Click on "Status" in the navigation menu
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
            `.trim(),
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
            <strong>Important:</strong> If you have already received this email before or checked the onboarding, please disregard this message.
            </div>
            
            <div class="content">
            <p>Dear ${name},</p>
            
            <p>This is a friendly reminder to complete your onboarding process with Codebility.</p>
            
            <div class="steps">
            <h3>Steps to complete your onboarding:</h3>
            <ol>
                <li>Visit our website: <a href="https://www.codebility.tech/">https://www.codebility.tech/</a></li>
                <li>Click on "Status" in the navigation menu</li>
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
            `,
        }

        await transporter.sendMail(mailOptions);
        console.log(`Onboarding reminder email sent successfully to: ${email}`);
    } catch (error) {
        console.error("Error sending onboarding reminder email:", error);
        throw new Error("Failed to send onboarding reminder email");
    }
}

export const sendPassedTestEmail = async ({ email, name }: { email: string, name: string }) => {
    try {

        const waitListLink = process.env.NEXT_PUBLIC_MESSENGER_WAITLIST
        const discordLink = process.env.NEXT_PUBLIC_DISCORD_LINK

        const mailOptions = {
            from: "Codebility Team",
            to: email, // Single recipient
            replyTo: 'Codebility.dev@gmail.com',
            headers: {
            'X-Priority': '3',
            'X-MSMail-Priority': 'Normal',
            'X-Mailer': 'Codebility Application System',
            },
            subject: "Congratulations on Passing the Assessment - Codebility",
            text: `
            Dear ${name},
            Congratulations for passing the Assessment!

            We are thrilled to inform you that you have successfully completed the assessment with Codebility.
            For now, please visit our website and check the status of your application.

            Steps to check your application status:
            1. Visit our website: https://www.codebility.tech/
            2. Click on "Status" in the navigation menu
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
            `.trim(),
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
            .congratulations {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
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
            <div class="congratulations">
            <strong>🎉 Congratulations!</strong> You have successfully passed the assessment!
            </div>
            
            <div class="content">
            <p>Dear ${name},</p>
            
            <p>We are thrilled to inform you that you have successfully completed the assessment with Codebility.</p>
            <p>For now, please visit our website and check the status of your application.</p>
            
            <div class="steps">
            <h3>Steps to check your application status:</h3>
            <ol>
            <li>Visit our website: <a href="https://www.codebility.tech/">https://www.codebility.tech/</a></li>
            <li>Click on "Status" in the navigation menu</li>
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
            `,
        }

        await transporter.sendMail(mailOptions);
        console.log(`Passed test email sent successfully to: ${email}`);

    } catch (error) {
        console.error("Error sending passed test email:", error);
        throw new Error("Failed to send passed test email");
    }
}

export const sendFailedTestEmail = async ({ email, name }: { email: string, name: string }) => {
    try {
        const mailOptions = {
            from: "Codebility Team",
            to: email, // Single recipient
            replyTo: 'Codebility.dev@gmail.com',
            headers: {
            'X-Priority': '3',
            'X-MSMail-Priority': 'Normal',
            'X-Mailer': 'Codebility Application System',
            },
            subject: "Test Result - Codebility",
            text: `
            Dear ${name},
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
            `.trim(),
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
            .result {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
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
            <div class="result">
            <strong>Test Result:</strong> We regret to inform you that you did not pass the assessment.
            </div>
            
            <div class="content">
            <p>Dear ${name},</p>
            
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
            `,
        }

        await transporter.sendMail(mailOptions);

    } catch (error) {
        console.error("Error sending failed test email:", error);
        throw new Error("Failed to send failed test email");
    }
}

export const sendDenyEmail = async ({ email, name }: { email: string, name: string }) => {
    try {
        const mailOptions = {
            from: "Codebility Team",
            to: email, // Single recipient
            replyTo: 'Codebility.dev@gmail.com',
            headers: {
            'X-Priority': '3',
            'X-MSMail-Priority': 'Normal',
            'X-Mailer': 'Codebility Application System',
            },
            subject: "Application Status - Codebility",
            text: `
    Dear ${name},
    Thank you for taking the time and applying to Codebility.

    We regret to inform you that your application has been denied.

    We encourage you to continue honing your skills and consider reapplying in the future.

    You can check the date on when you can reapply again by visiting our website and checking the status of your application.
            
    If you have any questions, please contact us at Codebility.dev@gmail.com

    Best regards,
    The Codebility Team

    Website: https://www.codebility.tech/
    Facebook: https://www.facebook.com/Codebilitydev
    LinkedIn: https://www.linkedin.com/company/codebilitytech/
    `.trim(),
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
            .result {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
            }
            .content {
            margin: 20px 0;
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
            <div class="result">
            <strong>Application Status:</strong> We regret to inform you that your application has been denied.
            </div>
            
            <div class="content">
            <p>Dear ${name},</p>
            
            <p>Thank you for taking the time and applying to Codebility.</p>
            
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
            `,
        }

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending deny email:", error);
        throw new Error("Failed to send deny email");
    }
}