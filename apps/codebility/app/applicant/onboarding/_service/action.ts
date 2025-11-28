"use server";

import { createClientServerComponent } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getOnboardingProgress(applicantId: string) {
  try {
    const supabase = await createClientServerComponent();

    const { data, error } = await supabase
      .from("onboarding_videos")
      .select("*")
      .eq("applicant_id", applicantId)
      .order("video_number", { ascending: true });

    if (error) {
      console.error("Error fetching onboarding progress:", error);
      return null;
    }

    // Transform the data into a more usable format
    const progress = {
      video1: data?.find((v) => v.video_number === 1)?.completed || false,
      video2: data?.find((v) => v.video_number === 2)?.completed || false,
      video3: data?.find((v) => v.video_number === 3)?.completed || false,
      video4: data?.find((v) => v.video_number === 4)?.completed || false,
      currentVideo: 1,
    };

    // Calculate current video (first incomplete video)
    if (progress.video1 && !progress.video2) progress.currentVideo = 2;
    else if (progress.video2 && !progress.video3) progress.currentVideo = 3;
    else if (progress.video3 && !progress.video4) progress.currentVideo = 4;
    else if (progress.video4) progress.currentVideo = 4; // All complete

    return { progress, videoRecords: data };
  } catch (error) {
    console.error("Error in getOnboardingProgress:", error);
    return null;
  }
}

export async function updateVideoProgress({
  applicantId,
  videoNumber,
  watchedDuration,
  totalDuration,
  completed,
}: {
  applicantId: string;
  videoNumber: number;
  watchedDuration: number;
  totalDuration: number;
  completed: boolean;
}) {
  try {
    const supabase = await createClientServerComponent();

    // Check if record exists
    const { data: existingRecord } = await supabase
      .from("onboarding_videos")
      .select("*")
      .eq("applicant_id", applicantId)
      .eq("video_number", videoNumber)
      .single();

    const updateData = {
      watched_duration: watchedDuration,
      total_duration: totalDuration,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    if (existingRecord) {
      // Update existing record
      const { error } = await supabase
        .from("onboarding_videos")
        .update(updateData)
        .eq("id", existingRecord.id);

      if (error) {
        console.error("Error updating video progress:", error);
        return { success: false, error };
      }
    } else {
      // Create new record
      const { error } = await supabase.from("onboarding_videos").insert({
        applicant_id: applicantId,
        video_number: videoNumber,
        ...updateData,
      });

      if (error) {
        console.error("Error creating video progress:", error);
        return { success: false, error };
      }
    }

    revalidatePath("/applicant/onboarding");
    return { success: true };
  } catch (error) {
    console.error("Error in updateVideoProgress:", error);
    return { success: false, error };
  }
}

export async function saveQuizProgress({
  applicantId,
  quizScore,
  quizTotal,
  passed,
}: {
  applicantId: string;
  quizScore: number;
  quizTotal: number;
  passed: boolean;
}) {
  try {
    const supabase = await createClientServerComponent();

    const { error } = await supabase
      .from("applicant")
      .update({
        quiz_score: quizScore,
        quiz_total: quizTotal,
        quiz_passed: passed,
        quiz_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", applicantId);

    if (error) {
      console.error("Error saving quiz progress:", error);
      return { success: false, error };
    }

    revalidatePath("/applicant/onboarding");
    return { success: true };
  } catch (error) {
    console.error("Error in saveQuizProgress:", error);
    return { success: false, error };
  }
}

export async function saveQuizAndCommitment({
  applicantId,
  quizScore,
  quizTotal,
  signature,
  canDoMobile,
}: {
  applicantId: string;
  quizScore: number;
  quizTotal: number;
  signature: string;
  canDoMobile: boolean;
}) {
  try {
    const supabase = await createClientServerComponent();

    const { error } = await supabase
      .from("applicant")
      .update({
        quiz_score: quizScore,
        quiz_total: quizTotal,
        signature_data: signature,
        can_do_mobile: canDoMobile,
        commitment_signed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", applicantId);

    if (error) {
      console.error("Error saving quiz and commitment:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in saveQuizAndCommitment:", error);
    return { success: false, error };
  }
}

export async function completeOnboarding(codevId: string, newStatus: string = "waitlist") {
  try {
    const supabase = await createClientServerComponent();

    // Update codev status to waitlist (or specified status)
    const { error } = await supabase
      .from("codev")
      .update({
        application_status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", codevId);

    if (error) {
      console.error("Error completing onboarding:", error);
      return { success: false, error };
    }

    revalidatePath("/applicant/onboarding");
    revalidatePath("/applicant/waiting");
    return { success: true };
  } catch (error) {
    console.error("Error in completeOnboarding:", error);
    return { success: false, error };
  }
}
