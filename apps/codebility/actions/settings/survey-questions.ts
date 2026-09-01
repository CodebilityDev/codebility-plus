"use server";

import { createClientServerComponent } from "@/utils/supabase/server";
import { z } from "zod";

// Schema for question settings
const questionSettingsSchema = z.object({
  required: z.boolean().default(false),
  placeholder: z.string().optional(),
  min_rating: z.number().optional(),
  max_rating: z.number().optional(),
  allow_other: z.boolean().optional(),
});

// Schema for creating/updating a question
const questionSchema = z.object({
  question_text: z.string().min(1, "Question text is required"),
  description: z.string().optional(),
  question_type: z.enum([
    "text",
    "textarea",
    "multiple_choice",
    "checkbox",
    "rating",
    "date",
    "email",
    "number"
  ]),
  options: z.array(z.string()).default([]),
  settings: questionSettingsSchema.default({ required: false }),
  order_index: z.number().default(0),
});

export async function createQuestion(surveyId: string, formData: z.infer<typeof questionSchema>) {
  try {
    const validatedData = questionSchema.parse(formData);
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
      .from("survey_questions")
      .insert({
        survey_id: surveyId,
        question_text: validatedData.question_text,
        description: validatedData.description,
        question_type: validatedData.question_type,
        options: validatedData.options,
        settings: validatedData.settings,
        order_index: validatedData.order_index,
      })
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
    return { error: "Failed to create question" };
  }
}

export async function updateQuestion(
  questionId: string,
  formData: z.infer<typeof questionSchema>
) {
  try {
    const validatedData = questionSchema.parse(formData);
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
      .from("survey_questions")
      .update({
        question_text: validatedData.question_text,
        description: validatedData.description,
        question_type: validatedData.question_type,
        options: validatedData.options,
        settings: validatedData.settings,
        order_index: validatedData.order_index,
        updated_at: new Date().toISOString(),
      })
      .eq("id", questionId)
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
    return { error: "Failed to update question" };
  }
}

export async function deleteQuestion(questionId: string) {
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
      .from("survey_questions")
      .delete()
      .eq("id", questionId);

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { error: "Failed to delete question" };
  }
}

export async function getSurveyQuestions(surveyId: string) {
  try {
    const supabase = await createClientServerComponent();

    const { data, error } = await supabase
      .from("survey_questions")
      .select("*")
      .eq("survey_id", surveyId)
      .order("order_index", { ascending: true });

    if (error) {
      return { error: error.message };
    }

    return { data: data || [], success: true };
  } catch (error) {
    return { error: "Failed to fetch questions" };
  }
}

export async function reorderQuestions(updates: Array<{ id: string; order_index: number }>) {
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

    // Update all questions
    const updatePromises = updates.map(({ id, order_index }) =>
      supabase
        .from("survey_questions")
        .update({ order_index })
        .eq("id", id)
    );

    await Promise.all(updatePromises);

    return { success: true };
  } catch (error) {
    return { error: "Failed to reorder questions" };
  }
}
