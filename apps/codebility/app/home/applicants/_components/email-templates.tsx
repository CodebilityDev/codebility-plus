// Email templates for assessment invitations
const EMAIL_TEMPLATES = {
  frontend: {
    subject: "Invitation to Complete Coding Assessment - Codebility",
    body: (name: string, position: string, days: string) => `Hello ${name},

Congratulations on passing the initial screening for the **${position}** at **Codebility**! We're excited to move forward with your application and would like to invite you to complete our **coding assessment**.

1. Fork the Repository
* Go to **https://github.com/Zeff01/codebility-assessment**
* Click the "Fork" button in the upper right corner
* This creates your own copy of the repository under your GitHub account

2. Select Your Category
You'll find separate README files for each experience level in the frontend, backend, mobile, and fullstack folders:
* 1–2 Years Experience
  * frontend/README_1_2_Years.md
  * backend/README-1-2-YEARS.md
  * mobile/README_1_2_Years.md
  * fullstack/README_1_2_Years.md
* 3–5 Years Experience
  * frontend/README_3_5_Years.md
  * backend/README-3-5-YEARS.md
  * mobile/README_3_5_Years.md
  * fullstack/README_3_5_Years.md
* 5+ Years Experience
  * frontend/README_5_Years_Plus.md
  * backend/README-5-YEARS-Plus.md
  * mobile/README_5_Years_Plus.md
  * fullstack/README_5_Years_Plus.md

Please pick the README that corresponds to your experience level (or the position you're applying for), then follow the instructions inside it.

3. Complete the Assessment Within ${days}
* We ask that you finish within **${days}**.
* If you need an extension, or run into any issues, just let us know.

4. Submit Your Work
* Each README will guide you on how to create your branch, implement the solution, and submit a Pull Request from your fork.
* Make sure to include any notes, explanations, or questions in your PR description.

We look forward to reviewing your code! If you have any questions at all, feel free to reply to this email.

Best regards,
Codebility Team`,
  },
  backend: {
    subject: "Invitation to Complete Coding Assessment - Codebility",
    body: (name: string, position: string, days: string) => `Hello ${name},

Congratulations on passing the initial screening for the **${position}** at **Codebility**! We're excited to move forward with your application and would like to invite you to complete our **coding assessment**.

1. Fork the Repository
* Go to **https://github.com/Zeff01/codebility-assessment**
* Click the "Fork" button in the upper right corner
* This creates your own copy of the repository under your GitHub account

2. Select Your Category
You'll find separate README files for each experience level in the frontend, backend, mobile, and fullstack folders:
* 1–2 Years Experience
  * frontend/README_1_2_Years.md
  * backend/README-1-2-YEARS.md
  * mobile/README_1_2_Years.md
  * fullstack/README_1_2_Years.md
* 3–5 Years Experience
  * frontend/README_3_5_Years.md
  * backend/README-3-5-YEARS.md
  * mobile/README_3_5_Years.md
  * fullstack/README_3_5_Years.md
* 5+ Years Experience
  * frontend/README_5_Years_Plus.md
  * backend/README-5-YEARS-Plus.md
  * mobile/README_5_Years_Plus.md
  * fullstack/README_5_Years_Plus.md

Please pick the README that corresponds to your experience level (or the position you're applying for), then follow the instructions inside it.

3. Complete the Assessment Within ${days}
* We ask that you finish within **${days}**.
* If you need an extension, or run into any issues, just let us know.

4. Submit Your Work
* Each README will guide you on how to create your branch, implement the solution, and submit a Pull Request from your fork.
* Make sure to include any notes, explanations, or questions in your PR description.

We look forward to reviewing your code! If you have any questions at all, feel free to reply to this email.

Best regards,
Codebility Team`,
  },
  mobile: {
    subject: "Invitation to Complete Coding Assessment - Codebility",
    body: (name: string, position: string, days: string) => `Hello ${name},

Congratulations on passing the initial screening for the **${position}** at **Codebility**! We're excited to move forward with your application and would like to invite you to complete our **coding assessment**.

1. Fork the Repository
* Go to **https://github.com/Zeff01/codebility-assessment**
* Click the "Fork" button in the upper right corner
* This creates your own copy of the repository under your GitHub account

2. Select Your Category
You'll find separate README files for each experience level in the frontend, backend, mobile, and fullstack folders:
* 1–2 Years Experience
  * frontend/README_1_2_Years.md
  * backend/README-1-2-YEARS.md
  * mobile/README_1_2_Years.md
  * fullstack/README_1_2_Years.md
* 3–5 Years Experience
  * frontend/README_3_5_Years.md
  * backend/README-3-5-YEARS.md
  * mobile/README_3_5_Years.md
  * fullstack/README_3_5_Years.md
* 5+ Years Experience
  * frontend/README_5_Years_Plus.md
  * backend/README-5-YEARS-Plus.md
  * mobile/README_5_Years_Plus.md
  * fullstack/README_5_Years_Plus.md

Please pick the README that corresponds to your experience level (or the position you're applying for), then follow the instructions inside it.

3. Complete the Assessment Within ${days}
* We ask that you finish within **${days}**.
* If you need an extension, or run into any issues, just let us know.

4. Submit Your Work
* Each README will guide you on how to create your branch, implement the solution, and submit a Pull Request from your fork.
* Make sure to include any notes, explanations, or questions in your PR description.

We look forward to reviewing your code! If you have any questions at all, feel free to reply to this email.

Best regards,
Codebility Team`,
  },
  fullstack: {
    subject: "Invitation to Complete Coding Assessment - Codebility",
    body: (name: string, position: string, days: string) => `Hello ${name},

Congratulations on passing the initial screening for the **${position}** at **Codebility**! We're excited to move forward with your application and would like to invite you to complete our **coding assessment**.

1. Fork the Repository
* Go to **https://github.com/Zeff01/codebility-assessment**
* Click the "Fork" button in the upper right corner
* This creates your own copy of the repository under your GitHub account

2. Select Your Category
You'll find separate README files for each experience level in the frontend, backend, mobile, and fullstack folders:
* 1–2 Years Experience
  * frontend/README_1_2_Years.md
  * backend/README-1-2-YEARS.md
  * mobile/README_1_2_Years.md
  * fullstack/README_1_2_Years.md
* 3–5 Years Experience
  * frontend/README_3_5_Years.md
  * backend/README-3-5-YEARS.md
  * mobile/README_3_5_Years.md
  * fullstack/README_3_5_Years.md
* 5+ Years Experience
  * frontend/README_5_Years_Plus.md
  * backend/README-5-YEARS-Plus.md
  * mobile/README_5_Years_Plus.md
  * fullstack/README_5_Years_Plus.md

Please pick the README that corresponds to your experience level (or the position you're applying for), then follow the instructions inside it.

3. Complete the Assessment Within ${days}
* We ask that you finish within **${days}**.
* If you need an extension, or run into any issues, just let us know.

4. Submit Your Work
* Each README will guide you on how to create your branch, implement the solution, and submit a Pull Request from your fork.
* Make sure to include any notes, explanations, or questions in your PR description.

We look forward to reviewing your code! If you have any questions at all, feel free to reply to this email.

Best regards,
Codebility Team`,
  },
  designer: {
    subject: "Invitation to Complete UI/UX Assessment - Codebility",
    body: (name: string, position: string, days: string) => `Hello ${name},

Congratulations on passing the initial screening for the **${position}** at **Codebility**! We're excited to move forward with your application and would like to invite you to complete our **UI/UX assessment**.

**🎯 Assessment Task** You'll be designing a **mobile e-commerce app** for a small boutique store. The task includes 5 core screens in Figma, and we've outlined clear objectives to guide you.

👉 **Access the full brief here:**
https://docs.google.com/document/d/1AOjPCuZHWxTmo9tH6k0_AmqMrdAnBvXz2MgyZ7OMfq0/edit?usp=share_link

**🕒 Deadline:** Please submit your work by **${days}**. If you need a bit more time, just let us know — we're happy to accommodate within reason.

**📬 Submission Instructions:** Once completed, please send:
* A **view-only Figma link** (or prototype link)
* Any supporting notes or a short slide explaining your design choices

Send your submission to this email address.

If you have any questions at all, feel free to reach out by replying to this email.

Looking forward to seeing your creativity come to life!

Best regards,
Codebility Team`,
  },
};

// Helper to determine days based on years of experience
export const getDaysBasedOnExperience = (years: number | undefined) => {
  if (!years) return "3-4 days"; // Default
  if (years <= 2) return "1-2 days";
  if (years <= 5) return "3-4 days";
  return "4-6 days";
};

// Create assessment email link based on role and experience
export const createAssessmentEmailLink = (
  email: string,
  firstName: string,
  lastName: string,
  position: string | undefined,
  yearsOfExperience: number | undefined,
  role: string,
) => {
  const name = `${firstName} ${lastName}`;
  const displayPosition = position || role;
  const days = getDaysBasedOnExperience(yearsOfExperience);

  const template = EMAIL_TEMPLATES[role as keyof typeof EMAIL_TEMPLATES];
  if (!template) return "";

  const subject = encodeURIComponent(template.subject);
  const body = encodeURIComponent(template.body(name, displayPosition, days));

  return `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
};

export default EMAIL_TEMPLATES;
