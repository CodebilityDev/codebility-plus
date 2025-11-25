"use server";

import { createClientServerComponent } from "@/utils/supabase/server";
import { deleteImage, getImagePath } from "@/utils/uploadImage";
import { z } from "zod";

const surveySchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().min(1, "Description is required"),
  survey_url: z.string().url("Must be a valid URL"),
  type: z.enum(["general", "feedback", "satisfaction", "research", "onboarding"]),
  image_url: z.string().optional(),
  target_audience: z.enum(["all", "codev", "intern", "hr", "admin"]),
  priority: z.number().min(1).max(100),
  is_active: z.boolean(),
  start_date: z.string(),
  end_date: z.string().optional(),
});

export async function createSurvey(formData: z.infer<typeof surveySchema>) {
  try {
    const validatedData = surveySchema.parse(formData);
    const supabase = await createClientServerComponent();

    // Get current user
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user.user) {
      return { error: "Authentication required" };
    }

    // Verify user is admin (role_id = 1)
    const { data: userRole, error: roleError } = await supabase
      .from("codev")
      .select("role_id")
      .eq("id", user.user.id)
      .single();

    if (roleError || userRole?.role_id !== 1) {
      return { error: "Admin access required" };
    }

    const surveyData = {
      title: validatedData.title,
      description: validatedData.description,
      survey_url: validatedData.survey_url,
      type: validatedData.type,
      image_url: validatedData.image_url || null,
      target_audience: validatedData.target_audience,
      priority: validatedData.priority,
      is_active: validatedData.is_active,
      start_date: new Date(validatedData.start_date).toISOString(),
      end_date: validatedData.end_date ? new Date(validatedData.end_date).toISOString() : null,
      created_by: user.user.id,
    };

    const { data, error } = await supabase
      .from("surveys")
      .insert(surveyData)
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
    return { error: "Failed to create survey" };
  }
}

export async function updateSurvey(
  surveyId: string,
  formData: z.infer<typeof surveySchema>
) {
  try {
    const validatedData = surveySchema.parse(formData);
    const supabase = await createClientServerComponent();

    // Get current user
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user.user) {
      return { error: "Authentication required" };
    }

    // Verify user is admin (role_id = 1)
    const { data: userRole, error: roleError } = await supabase
      .from("codev")
      .select("role_id")
      .eq("id", user.user.id)
      .single();

    if (roleError || userRole?.role_id !== 1) {
      return { error: "Admin access required" };
    }

    const surveyData = {
      title: validatedData.title,
      description: validatedData.description,
      survey_url: validatedData.survey_url,
      type: validatedData.type,
      image_url: validatedData.image_url || null,
      target_audience: validatedData.target_audience,
      priority: validatedData.priority,
      is_active: validatedData.is_active,
      start_date: new Date(validatedData.start_date).toISOString(),
      end_date: validatedData.end_date ? new Date(validatedData.end_date).toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("surveys")
      .update(surveyData)
      .eq("id", surveyId)
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
    return { error: "Failed to update survey" };
  }
}

export async function deleteSurvey(surveyId: string) {
  try {
    const supabase = await createClientServerComponent();

    // Get current user
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user.user) {
      return { error: "Authentication required" };
    }

    // Verify user is admin (role_id = 1)
    const { data: userRole, error: roleError } = await supabase
      .from("codev")
      .select("role_id")
      .eq("id", user.user.id)
      .single();

    if (roleError || userRole?.role_id !== 1) {
      return { error: "Admin access required" };
    }

    // First, get the survey to check if it has an image
    const { data: survey, error: fetchError } = await supabase
      .from("surveys")
      .select("image_url")
      .eq("id", surveyId)
      .single();

    if (fetchError) {
      return { error: "Survey not found" };
    }

    // Delete the survey from database
    const { error: deleteError } = await supabase
      .from("surveys")
      .delete()
      .eq("id", surveyId);

    if (deleteError) {
      return { error: deleteError.message };
    }

    // Clean up image from storage if it exists
    if (survey.image_url) {
      try {
        const imagePath = getImagePath(survey.image_url);
        if (imagePath) {
          await deleteImage(imagePath, "codebility");
        }
      } catch (imageError) {
        console.warn("Failed to delete survey image:", imageError);
        // Don't fail the whole operation if image deletion fails
      }
    }

    return { success: true };
  } catch (error) {
    return { error: "Failed to delete survey" };
  }
}

export async function toggleSurveyStatus(surveyId: string, isActive: boolean) {
  try {
    const supabase = await createClientServerComponent();

    // Get current user
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user.user) {
      return { error: "Authentication required" };
    }

    // Verify user is admin (role_id = 1)
    const { data: userRole, error: roleError } = await supabase
      .from("codev")
      .select("role_id")
      .eq("id", user.user.id)
      .single();

    if (roleError || userRole?.role_id !== 1) {
      return { error: "Admin access required" };
    }

    const { data, error } = await supabase
      .from("surveys")
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq("id", surveyId)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    return { data, success: true };
  } catch (error) {
    return { error: "Failed to update survey status" };
  }
}

export async function getActiveSurveys() {
  try {
    const supabase = await createClientServerComponent();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("surveys")
      .select("*")
      .eq("is_active", true)
      .or(`end_date.is.null,end_date.gte.${now}`)
      .lte("start_date", now)
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      return { error: error.message };
    }

    return { data: data || [], success: true };
  } catch (error) {
    return { error: "Failed to fetch surveys" };
  }
}

export async function getAllSurveys() {
  try {
    const supabase = await createClientServerComponent();

    // Get current user
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user.user) {
      return { error: "Authentication required" };
    }

    // Verify user is admin (role_id = 1)
    const { data: userRole, error: roleError } = await supabase
      .from("codev")
      .select("role_id")
      .eq("id", user.user.id)
      .single();

    if (roleError || userRole?.role_id !== 1) {
      return { error: "Admin access required" };
    }

    const { data, error } = await supabase
      .from("surveys")
      .select("*")
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      return { error: error.message };
    }

    return { data: data || [], success: true };
  } catch (error) {
    return { error: "Failed to fetch surveys" };
  }
}

export async function dismissSurvey(surveyId: string) {
  try {
    const supabase = await createClientServerComponent();

    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user.user) {
      return { error: "Authentication required" };
    }

    const { error } = await supabase
      .from("survey_dismissals")
      .insert({
        survey_id: surveyId,
        user_id: user.user.id,
      });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { error: "Failed to dismiss survey" };
  }
}

export async function undismissSurvey(surveyId: string) {
  try {
    const supabase = await createClientServerComponent();

    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user.user) {
      return { error: "Authentication required" };
    }

    const { error } = await supabase
      .from("survey_dismissals")
      .delete()
      .eq("survey_id", surveyId)
      .eq("user_id", user.user.id);

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { error: "Failed to reopen survey" };
  }
}

export async function getPendingSurveyForUser() {
  try {
    const supabase = await createClientServerComponent();

    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user.user) {
      return { error: "Authentication required" };
    }

    const now = new Date().toISOString();

    // Get active surveys
    const { data: surveys, error: surveysError } = await supabase
      .from("surveys")
      .select("id, title, description, type, target_audience, priority")
      .eq("is_active", true)
      .or(`end_date.is.null,end_date.gte.${now}`)
      .lte("start_date", now)
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false });

    if (surveysError) {
      return { error: surveysError.message };
    }

    if (!surveys || surveys.length === 0) {
      return { data: null };
    }

    // Get user's role info
    const { data: userInfo, error: userInfoError } = await supabase
      .from("codev")
      .select("role_id, application_status")
      .eq("id", user.user.id)
      .single();

    if (userInfoError) {
      return { error: userInfoError.message };
    }

    // Filter surveys by target audience
    const audienceMap: Record<string, boolean> = {
      all: true,
      admin: userInfo.role_id === 1,
      hr: userInfo.role_id === 2,
      codev: userInfo.role_id === 3,
      intern: userInfo.application_status === "passed",
    };

    const eligibleSurveys = surveys.filter(
      (survey) => audienceMap[survey.target_audience]
    );

    if (eligibleSurveys.length === 0) {
      return { data: null };
    }

    // Get surveys user has already responded to or dismissed
    const surveyIds = eligibleSurveys.map((s) => s.id);

    const { data: responses } = await supabase
      .from("survey_responses")
      .select("survey_id")
      .eq("respondent_id", user.user.id)
      .in("survey_id", surveyIds);

    const { data: dismissals } = await supabase
      .from("survey_dismissals")
      .select("survey_id")
      .eq("user_id", user.user.id)
      .in("survey_id", surveyIds);

    const respondedIds = new Set(responses?.map((r) => r.survey_id) || []);
    const dismissedIds = new Set(dismissals?.map((d) => d.survey_id) || []);

    // Find first survey not responded to or dismissed
    const pendingSurvey = eligibleSurveys.find(
      (survey) => !respondedIds.has(survey.id) && !dismissedIds.has(survey.id)
    );

    if (!pendingSurvey) {
      return { data: null };
    }

    // Get questions for this survey
    const { data: questions, error: questionsError } = await supabase
      .from("survey_questions")
      .select("*")
      .eq("survey_id", pendingSurvey.id)
      .order("order_index", { ascending: true });

    if (questionsError) {
      return { error: questionsError.message };
    }

    return {
      data: {
        ...pendingSurvey,
        questions: questions || [],
      },
    };
  } catch (error) {
    return { error: "Failed to fetch pending survey" };
  }
}

export async function getDismissedSurveys() {
  try {
    const supabase = await createClientServerComponent();

    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user.user) {
      return { error: "Authentication required" };
    }

    const now = new Date().toISOString();

    // Get user's dismissals
    const { data: dismissals, error: dismissalsError } = await supabase
      .from("survey_dismissals")
      .select("survey_id")
      .eq("user_id", user.user.id);

    if (dismissalsError) {
      return { error: dismissalsError.message };
    }

    if (!dismissals || dismissals.length === 0) {
      return { data: [] };
    }

    const dismissedIds = dismissals.map((d) => d.survey_id);

    // Get those surveys if they're still active
    const { data: surveys, error: surveysError } = await supabase
      .from("surveys")
      .select("id, title, description, type")
      .in("id", dismissedIds)
      .eq("is_active", true)
      .or(`end_date.is.null,end_date.gte.${now}`)
      .lte("start_date", now);

    if (surveysError) {
      return { error: surveysError.message };
    }

    // Filter out surveys already responded to
    const { data: responses } = await supabase
      .from("survey_responses")
      .select("survey_id")
      .eq("respondent_id", user.user.id)
      .in("survey_id", dismissedIds);

    const respondedIds = new Set(responses?.map((r) => r.survey_id) || []);

    const availableDismissed = (surveys || []).filter(
      (survey) => !respondedIds.has(survey.id)
    );

    return { data: availableDismissed };
  } catch (error) {
    return { error: "Failed to fetch dismissed surveys" };
  }
}
