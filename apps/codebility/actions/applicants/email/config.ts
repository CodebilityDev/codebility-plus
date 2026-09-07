import type { EmailConfig } from "./types";

export const DEFAULT_EMAIL_CONFIG: EmailConfig = {
  from: "Codebility Team <Codebility.dev@codebility.tech>",
  cc: [
    "christian.codebility@gmail.com",
    "kyla.codebility@gmail.com",
    "allana.codebility@gmail.com",
  ],
  to: "Codebility.dev@gmail.com",
};

export const EMAIL_STYLES = `
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
`;
