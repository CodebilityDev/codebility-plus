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
