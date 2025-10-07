// app/api/profile-points/[codevId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClientServerComponent } from "@/utils/supabase/server";
import { z } from "zod";

// Define point rules - category now matches codev table column names
const POINT_RULES = {
  image_url: { points: 5 },
  about: { points: 3 },
  phone_number: { points: 2 },
  github: { points: 2 },
  facebook: { points: 2 },
  linkedin: { points: 2 },
  discord: { points: 2 },
  portfolio_website: { points: 5 },
};

// Helper function to check if a field is filled
function isFieldFilled(value: any): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

// Validation schemas
const codevIdSchema = z.string().uuid("Invalid codev ID format");

// Type for profile points insertion
interface ProfilePointInsert {
  codev_id: string;
  category: string;
  points: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ codevId: string }> }
) {
  try {
    // Await params (Next.js 15 requirement)
    const { codevId } = await params;
    
    // Validate codevId format
    const validationResult = codevIdSchema.safeParse(codevId);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Invalid codev ID format",
          details: validationResult.error.errors.map(e => e.message).join(", ")
        },
        { status: 400 }
      );
    }

    const validCodevId = validationResult.data;
    const supabase = await createClientServerComponent();

    // Verify user authentication and authorization
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user can access this profile (own profile or admin)
    const { data: userRole, error: roleError } = await supabase
      .from("codev")
      .select("id, role_id")
      .eq("id", user.id)
      .single();

    if (roleError || !userRole) {
      return NextResponse.json({ error: "Failed to verify user permissions" }, { status: 403 });
    }

    // Allow access if it's the user's own profile or if user has admin role (assuming role_id 1 is admin)
    const isAdmin = userRole.role_id === 1;
    const isOwnProfile = user.id === validCodevId;
    
    if (!isAdmin && !isOwnProfile) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // First, get the numeric ID from the codev table using the validated UUID
    const { data: codevData, error: codevError } = await supabase
      .from("codev")
      .select("id, image_url, tech_stacks, about, phone_number, github, facebook, linkedin, discord, portfolio_website")
      .eq('id', validCodevId)
      .single();

    if (codevError) {
      console.error("Error fetching codev data:", codevError);
      return NextResponse.json({ 
        error: "Failed to fetch profile",
        details: codevError.message 
      }, { status: 500 });
    }

    if (!codevData) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Fetch work experiences from work_experience table
    const { data: workExperiences, error: workExpError } = await supabase
      .from("work_experience")
      .select("id, position, company_name")
      .eq('codev_id', validCodevId);

    if (workExpError) {
      console.error("Error fetching work experiences:", workExpError);
    }

    // Calculate points and prepare data to insert/update
    const pointsToInsert: ProfilePointInsert[] = [];
    let totalPoints = 0;

    // Check each field from POINT_RULES
    for (const [field, config] of Object.entries(POINT_RULES)) {
      if (isFieldFilled(codevData[field])) {
        pointsToInsert.push({
          codev_id: validCodevId,
          category: field,
          points: config.points,
        });
        totalPoints += config.points;
      }
    }

    // Handle tech_stacks (skills) - 1 point per skill
    if (isFieldFilled(codevData.tech_stacks)) {
      const skills = Array.isArray(codevData.tech_stacks) 
        ? codevData.tech_stacks 
        : codevData.tech_stacks;
      
      const skillCount = Array.isArray(skills) ? skills.length : 0;
      
      if (skillCount > 0) {
        pointsToInsert.push({
          codev_id: validCodevId,
          category: 'tech_stacks',
          points: skillCount,
        });
        totalPoints += skillCount;
      }
    }

    // Handle work experiences - 5 points per experience
    if (workExperiences && workExperiences.length > 0) {
      const workExpPoints = workExperiences.length * 5;
      pointsToInsert.push({
        codev_id: validCodevId,
        category: 'work_experience',
        points: workExpPoints,
      });
      totalPoints += workExpPoints;
    }

    // Delete existing points for this user to avoid duplicates
    const { error: deleteError } = await supabase
      .from("profile_points")
      .delete()
      .eq('codev_id', validCodevId);

    if (deleteError) {
      console.error("Error deleting old points:", deleteError);
      // Continue even if delete fails
    }

    // Insert new points into profile_points table
    if (pointsToInsert.length > 0) {
      console.log("Attempting to insert points:", pointsToInsert);
      
      const { error: insertError } = await supabase
        .from("profile_points")
        .insert(pointsToInsert);

      if (insertError) {
        console.error("Error inserting points:", insertError);
        console.error("Insert error details:", {
          message: insertError.message,
          code: insertError.code,
          details: insertError.details,
          hint: insertError.hint
        });
        return NextResponse.json({ 
          error: "Failed to save points",
          message: insertError.message,
          code: insertError.code,
          hint: insertError.hint
        }, { status: 500 });
      }
    }

    // Fetch the saved points to return
    const { data: savedPoints, error: fetchError } = await supabase
      .from("profile_points")
      .select("*")
      .eq('codev_id', validCodevId)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error("Error fetching saved points:", fetchError);
      return NextResponse.json({ 
        error: "Failed to fetch saved points",
        details: fetchError.message 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      totalPoints,
      pointsCount: savedPoints?.length || 0,
      points: savedPoints,
      breakdown: pointsToInsert,
      workExperienceCount: workExperiences?.length || 0,
    });

  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}