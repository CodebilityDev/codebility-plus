// Re-export all email functions from action files

// Test Reminder exports
export {
  sendTestReminder,
  sendMultipleTestReminderEmail,
  sendTestReminderWithUpdate,
  sendMultipleTestReminderEmailWithUpdate,
  sendTestReminderForConfig,
} from "./actions/testReminder";

// Onboarding Reminder exports
export {
  sendOnboardingReminder,
  sendMultipleOnboardingReminder,
  sendOnboardingReminderWithUpdate,
  sendMultipleOnboardingReminderWithUpdate,
  sendOnboardingReminderForConfig,
} from "./actions/onboardingReminder";

// Passed Test exports
export {
  sendPassedTestEmail,
  sendMultiplePassedTestEmail,
  sendPassedTestEmailForConfig,
} from "./actions/passedTest";

// Failed Test exports
export {
  sendFailedTestEmail,
  sendMultipleFailedTestEmail,
  sendFailedTestEmailForConfig,
} from "./actions/failedTest";

// Deny exports
export {
  sendDenyEmail,
  sendMultipleDenyEmail,
  sendDenyEmailForConfig,
} from "./actions/deny";

// Accepted exports
export {
  sendAcceptedEmail,
  sendAcceptedEmailForConfig,
} from "./actions/accepted";

// Re-export types
export type { EmailRecipient, ApplicantEmailData, EmailConfig } from "./types";
