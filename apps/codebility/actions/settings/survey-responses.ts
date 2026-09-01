"use server";

import { createClientServerComponent } from "@/utils/supabase/server";
import { z } from "zod";

const responseSchema = z.object({
  answers: z.record(z.union([
    z.string(),
    z.number(),
    z.array(z.string()),
    z.boolean()
  ])),
  respondent_email: z.string().email().optional(),
  status: z.enum(["draft", "completed"]).default("completed"),
});

export async function submitSurveyResponse(
  surveyId: string,
  formData: z.infer<typeof responseSchema>
) {
  try {
    const validatedData = responseSchema.parse(formData);
    const supabase = await createClientServerComponent();

    // Get current user (optional for anonymous surveys)
    const { data: { user } } = await supabase.auth.getUser();

    const responseData = {
      survey_id: surveyId,
      respondent_id: user?.id || null,
      respondent_email: validatedData.respondent_email || user?.email || null,
      answers: validatedData.answers,
      status: validatedData.status,
      submitted_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("survey_responses")
      .insert(responseData)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    return { data, success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Failed to submit survey response" };
  }
}

export async function getSurveyResponses(surveyId: string) {
  try {
    const supabase = await createClientServerComponent();

    // Verify user is admin
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user.user) {
      return { error: "Authentication required" };
    }

    const { data: userRole, error: roleError } = await supabase
      .from("codev")
      .select("role_id")
      .eq("id", user.user.id)
      .single();

    if (roleError || userRole?.role_id !== 1) {
      return { error: "Admin access required" };
    }

    const { data, error } = await supabase
      .from("survey_responses")
      .select(`
        *,
        respondent:respondent_id(first_name, last_name, email_address)
      `)
      .eq("survey_id", surveyId)
      .order("submitted_at", { ascending: false });

    if (error) {
      return { error: error.message };
    }

    return { data: data || [], success: true };
  } catch (error) {
    return { error: "Failed to fetch responses" };
  }
}

export async function getSurveyStatistics(surveyId: string) {
  try {
    const supabase = await createClientServerComponent();

    // Verify user is admin
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user.user) {
      return { error: "Authentication required" };
    }

    const { data: userRole, error: roleError } = await supabase
      .from("codev")
      .select("role_id")
      .eq("id", user.user.id)
      .single();

    if (roleError || userRole?.role_id !== 1) {
      return { error: "Admin access required" };
    }

    const { data, error } = await supabase
      .rpc("get_survey_statistics", { p_survey_id: surveyId })
      .single();

    if (error) {
      return { error: error.message };
    }

    return { data, success: true };
  } catch (error) {
    return { error: "Failed to fetch statistics" };
  }
}

export async function getQuestionResponseSummary(surveyId: string, questionId: string) {
  try {
    const supabase = await createClientServerComponent();

    // Verify user is admin
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user.user) {
      return { error: "Authentication required" };
    }

    const { data: userRole, error: roleError } = await supabase
      .from("codev")
      .select("role_id")
      .eq("id", user.user.id)
      .single();

    if (roleError || userRole?.role_id !== 1) {
      return { error: "Admin access required" };
    }

    const { data, error } = await supabase
      .rpc("get_question_response_summary", {
        p_survey_id: surveyId,
        p_question_id: questionId
      });

    if (error) {
      return { error: error.message };
    }

    return { data: data || [], success: true };
  } catch (error) {
    return { error: "Failed to fetch question summary" };
  }
}

export async function deleteResponse(responseId: string) {
  try {
    const supabase = await createClientServerComponent();

    // Verify user is admin
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user.user) {
      return { error: "Authentication required" };
    }

    const { data: userRole, error: roleError } = await supabase
      .from("codev")
      .select("role_id")
      .eq("id", user.user.id)
      .single();

    if (roleError || userRole?.role_id !== 1) {
      return { error: "Admin access required" };
    }

    const { error } = await supabase
      .from("survey_responses")
      .delete()
      .eq("id", responseId);

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { error: "Failed to delete response" };
  }
}

export async function hasUserResponded(surveyId: string) {
  try {
    const supabase = await createClientServerComponent();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { hasResponded: false, success: true };
    }

    const { data, error } = await supabase
      .from("survey_responses")
      .select("id")
      .eq("survey_id", surveyId)
      .eq("respondent_id", user.id)
      .eq("status", "completed")
      .limit(1);

    if (error) {
      return { error: error.message };
    }

    return { hasResponded: (data?.length || 0) > 0, success: true };
  } catch (error) {
    return { error: "Failed to check response status" };
  }
}
