export interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: string[];
}

export interface SurveyResponse {
  id: string;
  answers: Record<string, any>;
  submitted_at: string;
  respondent: {
    first_name: string;
    last_name: string;
    email_address: string;
  } | null;
  respondent_email: string | null;
}

export interface Statistics {
  total_responses: number;
  completed_responses: number;
  unique_respondents: number;
  last_response_at: string;
}
