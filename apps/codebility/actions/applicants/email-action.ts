"use server";

import { Resend } from "resend";

export const sendMultipleTestReminderEmail = async (emails: string[]) => {
    try {
        const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
            from: "Codebility Team <Codebility.dev@codebility.tech>",
            bcc: emails, // Use BCC for mass sending
            cc: ['christian.codebility@gmail.com', 'kyla.codebility@gmail.com', 'allana.codebility@gmail.com'],
            to: "Codebility.dev@gmail.com", // Use BCC for mass sending
            subject: "Application Reminder - Codebility",
            text: `
            Dear Applicant,

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
            `,
        })

        if (error) {
            console.error("Resend API error:", error);
            throw new Error("Failed to send emails");
        }


    } catch (error) {
        console.error("Error sending emails:", error);
        throw new Error("Failed to send emails");
    }
}


export const sendTestReminder = async ({ email, name }: { email: string, name: string }) => {
    try {
        const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);


        const { data, error } = await resend.emails.send({
            from: "Codebility Team <Codebility.dev@codebility.tech>",
            to: email, // Single recipient
            cc: ['christian.codebility@gmail.com', 'kyla.codebility@gmail.com', 'allana.codebility@gmail.com'],
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

                ⏰ DEADLINE REMINDER: You have 5 days from the date of your application to complete the test. Please take action soon!

                Steps to complete your application:
                1. Visit and Sign in to our website: https://www.codebility.tech/auth/sign-in
                2. Once Sign in, Click on "Status" in the navigation menu
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

                          <div class="disclaimer" style="background-color: #fff3cd; border: 2px solid #ff9800; padding: 15px; margin: 20px 0; border-radius: 5px;">
                              <strong>⏰ DEADLINE REMINDER:</strong> You have <strong>5 days</strong> from the date of your application to complete the test. Please take action soon!
                          </div>

                          <div class="steps">
                              <h3>Steps to complete your application:</h3>
                              <ol>
                                  <li>Visit and Sign in to our website: <a href="https://www.codebility.tech/auth/sign-in">https://www.codebility.tech/auth/sign-in</a></li>
                                  <li>Once Signed, In Click on "Status" in the navigation menu</li>
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
        })

        if (error) {
            console.error("Resend API error:", error);
            throw new Error("Failed to send test reminder");
        }
    } catch (error) {
        console.error("Error sending test reminder:", error);
        throw new Error("Failed to send test reminder");
    }
}


export const sendMultipleOnboardingReminder = async (emails: string[]) => {
    try {
        const waitListLink = process.env.NEXT_PUBLIC_MESSENGER_WAITLIST
        const discordLink = process.env.NEXT_PUBLIC_DISCORD_LINK
        const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);


        const { data, error } = await resend.emails.send({
            from: "Codebility Team <Codebility.dev@codebility.tech>",
            bcc: emails, // Use BCC for mass sending
            cc: ['christian.codebility@gmail.com', 'kyla.codebility@gmail.com', 'allana.codebility@gmail.com'],
            to: "Codebility.dev@gmail.com", // Use BCC for mass sending
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
            `,
        })


    } catch (error) {
        console.error("Error sending onboarding reminder emails:", error);
        throw new Error("Failed to send onboarding reminder emails");
    }
}

export const sendOnboardingReminder = async ({ email, name }: { email: string, name: string }) => {
    try {
        const waitListLink = process.env.NEXT_PUBLIC_MESSENGER_WAITLIST
        const discordLink = process.env.NEXT_PUBLIC_DISCORD_LINK

        const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);


        const { data, error } = await resend.emails.send({
            from: "Codebility Team <Codebility.dev@codebility.tech>",
            to: email, // Single recipient
            cc: ['christian.codebility@gmail.com', 'kyla.codebility@gmail.com', 'allana.codebility@gmail.com'],
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
            1. Visit and Sign in to our website: https://www.codebility.tech/auth/sign-in
            2. Once Sign in, Click on "Status" in the navigation menu
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
            `,
        })

        if (error) {
            console.error("Resend API error:", error);
            throw new Error("Failed to send onboarding reminder");
        }
    } catch (error) {
        console.error("Error sending onboarding reminder email:", error);
        throw new Error("Failed to send onboarding reminder email");
    }
}

export const sendMultiplePassedTestEmail = async (Applicant: { email: string, name: string }[]) => {
    try {
        const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

        for (const applicant of Applicant) {
            const { email, name } = applicant;

            const waitListLink = process.env.NEXT_PUBLIC_MESSENGER_WAITLIST
            const discordLink = process.env.NEXT_PUBLIC_DISCORD_LINK

            const { data, error } = await resend.emails.send({
                from: "Codebility Team <Codebility.dev@codebility.tech>",
                to: email, // Single recipient
                cc: ['christian.codebility@gmail.com', 'kyla.codebility@gmail.com', 'allana.codebility@gmail.com'],
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
            1. Visit and Sign in to our website: https://www.codebility.tech/auth/sign-in
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
            `,
            })

            if (error) {
                console.error(`Resend API error for ${name} (${email}):`, error);
                throw new Error(`Failed to send email to ${name}`);
            }
        }
    } catch (error) {
        console.error("Error sending multiple passed test emails:", error);
        throw new Error("Failed to send multiple passed test emails");
    }
}

export const sendPassedTestEmail = async ({ email, name }: { email: string, name: string }) => {
    try {
        const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

        const waitListLink = process.env.NEXT_PUBLIC_MESSENGER_WAITLIST
        const discordLink = process.env.NEXT_PUBLIC_DISCORD_LINK

        const { data, error } = await resend.emails.send({
            from: "Codebility Team <Codebility.dev@codebility.tech>",
            to: email, // Single recipient
            cc: ['christian.codebility@gmail.com', 'kyla.codebility@gmail.com', 'allana.codebility@gmail.com'],
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
            `,
        })

        if (error) {
            console.error(`Resend API error for ${name} (${email}):`, error);
            throw new Error(`Failed to send email to ${name}`);
        }
    } catch (error) {
        console.error("Error sending passed test email:", error);
        throw new Error("Failed to send passed test email");
    }
}

export const sendMultipleFailedTestEmail = async (Applicant: { email: string, name: string }[]) => {
    try {
        const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

        for (const applicant of Applicant) {
            const { email, name } = applicant;

            const { data, error } = await resend.emails.send({
                from: "Codebility Team <Codebility.dev@codebility.tech>",
                to: email, // Single recipient
                replyTo: 'Codebility.dev@gmail.com',
                cc: ['christian.codebility@gmail.com', 'kyla.codebility@gmail.com', 'allana.codebility@gmail.com'],
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
            })

            if (error) {
                console.error(`Resend API error for ${name} (${email}):`, error);
                throw new Error(`Failed to send email to ${name}`);
            }
        }
    } catch (error) {
        console.error("Error sending multiple failed test emails:", error);
        throw new Error("Failed to send multiple failed test emails");
    }
}

export const sendFailedTestEmail = async ({ email, name }: { email: string, name: string }) => {
    try {
        const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
            from: "Codebility Team <Codebility.dev@codebility.tech>",
            to: email, // Single recipient
            replyTo: 'Codebility.dev@gmail.com',
            cc: ['christian.codebility@gmail.com', 'kyla.codebility@gmail.com', 'allana.codebility@gmail.com'],
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
        })
        if (error) {
            console.error(`Resend API error for ${name} (${email}):`, error);
            throw new Error(`Failed to send email to ${name}`);
        }

    } catch (error) {
        console.error("Error sending failed test email:", error);
        throw new Error("Failed to send failed test email");
    }
}

export const sendMultipleDenyEmail = async (Applicant: { email: string, name: string }[]) => {
    try {
        const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

        for (const applicant of Applicant) {
            const { email, name } = applicant;

            const { data, error } = await resend.emails.send({
                from: "Codebility Team <Codebility.dev@codebility.tech>",
                to: email, // Single recipient
                replyTo: 'Codebility.dev@gmail.com',
                cc: ['christian.codebility@gmail.com', 'kyla.codebility@gmail.com', 'allana.codebility@gmail.com'],
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
            })

            if (error) {
                console.error(`Resend API error for ${name} (${email}):`, error);
                throw new Error(`Failed to send email to ${name}`);
            }
        }
    } catch (error) {
        console.error("Error sending multiple deny emails:", error);
        throw new Error("Failed to send multiple deny emails");
    }
}

export const sendDenyEmail = async ({ email, name }: { email: string, name: string }) => {
    try {
        const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
            from: "Codebility Team <Codebility.dev@codebility.tech>",
            to: email, // Single recipient
            cc: ['christian.codebility@gmail.com', 'kyla.codebility@gmail.com', 'allana.codebility@gmail.com'],
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
        })

        if (error) {
            console.error(`Resend API error for ${name} (${email}):`, error);
            throw new Error(`Failed to send email to ${name}`);
        }
    } catch (error) {
        console.error("Error sending deny email:", error);
        throw new Error("Failed to send deny email");
    }
}

// New wrapper functions that handle both email sending and database updates
export const sendTestReminderWithUpdate = async ({ email, name, applicantId }: { email: string, name: string, applicantId: string }) => {
    const { updateReminderCountAction } = await import('./action');
    
    try {
        // Send the email first
        await sendTestReminder({ email, name });
        
        // Update the reminder count and date in the database
        await updateReminderCountAction(applicantId);
    } catch (error) {
        console.error("Error sending test reminder with update:", error);
        throw new Error("Failed to send test reminder with update");
    }
}

export const sendOnboardingReminderWithUpdate = async ({ email, name, applicantId }: { email: string, name: string, applicantId: string }) => {
    const { updateReminderCountAction } = await import('./action');
    
    try {
        // Send the email first
        await sendOnboardingReminder({ email, name });
        
        // Update the reminder count and date in the database
        await updateReminderCountAction(applicantId);
    } catch (error) {
        console.error("Error sending onboarding reminder with update:", error);
        throw new Error("Failed to send onboarding reminder with update");
    }
}

// Wrapper functions for config compatibility - these will be used by the action config
export const sendTestReminderForConfig = async (email: string) => {
    // This function will be called from useApplicantActions, but we need applicant data
    // We'll need to get the applicant data from the database first
    const { createClientServerComponent } = await import('@/utils/supabase/server');
    const { updateReminderCountAction } = await import('./action');
    
    try {
        const supabase = await createClientServerComponent();
        
        // Get applicant data by email
        const { data: applicantData, error: queryError } = await supabase
            .from('codev')
            .select('id, first_name, last_name')
            .eq('email_address', email)
            .single();
            
        if (queryError) {
            console.error('Error querying applicant data:', queryError);
            throw new Error(`Failed to query applicant data: ${queryError.message}`);
        }
            
        if (!applicantData) {
            console.error('Applicant not found for email:', email);
            throw new Error('Applicant not found');
        }
        
        // Send the email first
        await sendTestReminder({ 
            email, 
            name: `${applicantData.first_name} ${applicantData.last_name}` 
        });
        
        // Update the reminder count and date in the database
        await updateReminderCountAction(applicantData.id);
    } catch (error) {
        console.error("Error sending test reminder for config:", error);
        throw new Error("Failed to send test reminder");
    }
}

export const sendOnboardingReminderForConfig = async (email: string) => {
    // This function will be called from useApplicantActions, but we need applicant data
    // We'll need to get the applicant data from the database first
    const { createClientServerComponent } = await import('@/utils/supabase/server');
    const { updateReminderCountAction } = await import('./action');
    
    try {
        const supabase = await createClientServerComponent();
        
        // Get applicant data by email
        const { data: applicantData } = await supabase
            .from('codev')
            .select('id, first_name, last_name')
            .eq('email_address', email)
            .single();
            
        if (!applicantData) {
            throw new Error('Applicant not found');
        }
        
        // Send the email first
        await sendOnboardingReminder({ 
            email, 
            name: `${applicantData.first_name} ${applicantData.last_name}` 
        });
        
        // Update the reminder count and date in the database
        await updateReminderCountAction(applicantData.id);
    } catch (error) {
        console.error("Error sending onboarding reminder for config:", error);
        throw new Error("Failed to send onboarding reminder");
    }
}

export const sendPassedTestEmailForConfig = async (email: string) => {
    const { createClientServerComponent } = await import('@/utils/supabase/server');
    
    try {
        const supabase = await createClientServerComponent();
        
        // Get applicant data by email
        const { data: applicantData } = await supabase
            .from('codev')
            .select('first_name, last_name')
            .eq('email_address', email)
            .single();
            
        if (!applicantData) {
            throw new Error('Applicant not found');
        }
        
        await sendPassedTestEmail({ 
            email, 
            name: `${applicantData.first_name} ${applicantData.last_name}` 
        });
    } catch (error) {
        console.error("Error sending passed test email for config:", error);
        throw new Error("Failed to send passed test email");
    }
}

export const sendFailedTestEmailForConfig = async (email: string) => {
    const { createClientServerComponent } = await import('@/utils/supabase/server');
    
    try {
        const supabase = await createClientServerComponent();
        
        // Get applicant data by email
        const { data: applicantData } = await supabase
            .from('codev')
            .select('first_name, last_name')
            .eq('email_address', email)
            .single();
            
        if (!applicantData) {
            throw new Error('Applicant not found');
        }
        
        await sendFailedTestEmail({ 
            email, 
            name: `${applicantData.first_name} ${applicantData.last_name}` 
        });
    } catch (error) {
        console.error("Error sending failed test email for config:", error);
        throw new Error("Failed to send failed test email");
    }
}

export const sendDenyEmailForConfig = async (email: string) => {
    const { createClientServerComponent } = await import('@/utils/supabase/server');
    
    try {
        const supabase = await createClientServerComponent();
        
        // Get applicant data by email
        const { data: applicantData } = await supabase
            .from('codev')
            .select('first_name, last_name')
            .eq('email_address', email)
            .single();
            
        if (!applicantData) {
            throw new Error('Applicant not found');
        }
        
        await sendDenyEmail({ 
            email, 
            name: `${applicantData.first_name} ${applicantData.last_name}` 
        });
    } catch (error) {
        console.error("Error sending deny email for config:", error);
        throw new Error("Failed to send deny email");
    }
}

export const sendMultipleTestReminderEmailWithUpdate = async (applicants: { email: string, applicantId: string }[]) => {
    const { updateMultipleReminderCountAction } = await import('./action');
    
    try {
        // Send the emails first
        const emails = applicants.map(applicant => applicant.email);
        await sendMultipleTestReminderEmail(emails);
        
        // Update the reminder counts and dates in the database
        const applicantIds = applicants.map(applicant => applicant.applicantId);
        await updateMultipleReminderCountAction(applicantIds);
    } catch (error) {
        console.error("Error sending multiple test reminders with update:", error);
        throw new Error("Failed to send multiple test reminders with update");
    }
}

export const sendMultipleOnboardingReminderWithUpdate = async (applicants: { email: string, applicantId: string }[]) => {
    const { updateMultipleReminderCountAction } = await import('./action');

    try {
        // Send the emails first
        const emails = applicants.map(applicant => applicant.email);
        await sendMultipleOnboardingReminder(emails);

        // Update the reminder counts and dates in the database
        const applicantIds = applicants.map(applicant => applicant.applicantId);
        await updateMultipleReminderCountAction(applicantIds);
    } catch (error) {
        console.error("Error sending multiple onboarding reminders with update:", error);
        throw new Error("Failed to send multiple onboarding reminders with update");
    }
}

export const sendAcceptedEmail = async ({ email, name }: { email: string, name: string }) => {
    try {
        const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

        const { data, error} = await resend.emails.send({
            from: "Codebility Team <Codebility.dev@codebility.tech>",
            to: email,
            cc: ['christian.codebility@gmail.com', 'kyla.codebility@gmail.com', 'allana.codebility@gmail.com'],
            replyTo: 'Codebility.dev@gmail.com',
            headers: {
                'X-Priority': '1', // High priority
                'X-MSMail-Priority': 'High',
                'X-Mailer': 'Codebility Application System',
            },
            subject: "🎉 Congratulations! You've Been Accepted to Codebility",
            text: `
Dear ${name},

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
        .content {
            margin: 20px 0;
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
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #666;
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
        .logo {
            max-width: 150px;
            height: auto;
            margin: 20px 0;
        }
        a {
            color: #2196f3;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
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
        <p>Dear ${name},</p>

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
            `,
        })

        if (error) {
            console.error(`Resend API error for ${name} (${email}):`, error);
            throw new Error(`Failed to send acceptance email to ${name}`);
        }
    } catch (error) {
        console.error("Error sending acceptance email:", error);
        throw new Error("Failed to send acceptance email");
    }
}

export const sendAcceptedEmailForConfig = async (email: string) => {
    const { createClientServerComponent } = await import('@/utils/supabase/server');

    try {
        const supabase = await createClientServerComponent();

        // Get applicant data by email
        const { data: applicantData } = await supabase
            .from('codev')
            .select('first_name, last_name')
            .eq('email_address', email)
            .single();

        if (!applicantData) {
            throw new Error('Applicant not found');
        }

        await sendAcceptedEmail({
            email,
            name: `${applicantData.first_name} ${applicantData.last_name}`
        });
    } catch (error) {
        console.error("Error sending acceptance email for config:", error);
        throw new Error("Failed to send acceptance email");
    }
}