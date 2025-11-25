// app/api/profile-points/[codevId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClientServerComponent } from "@/utils/supabase/server";
import { z } from "zod";

// Enhanced point rules with limits and validation
const POINT_RULES = {
  // Basic profile information
  image_url: { 
    points: 5, 
    maxPoints: 5, 
    isOneTime: true,
    description: "Profile photo upload"
  },
  about: { 
    points: 3, 
    maxPoints: 3, 
    isOneTime: true,
    minLength: 50,
    description: "About section (minimum 50 characters)"
  },
  phone_number: { 
    points: 2, 
    maxPoints: 2, 
    isOneTime: true,
    description: "Phone number"
  },
  address: { 
    points: 2, 
    maxPoints: 2, 
    isOneTime: true,
    description: "Complete address"
  },
  
  // Social/Professional links
  github: { 
    points: 2, 
    maxPoints: 2, 
    isOneTime: true,
    description: "GitHub profile link"
  },
  linkedin: { 
    points: 2, 
    maxPoints: 2, 
    isOneTime: true,
    description: "LinkedIn profile link"
  },
  facebook: { 
    points: 1, 
    maxPoints: 1, 
    isOneTime: true,
    description: "Facebook profile link"
  },
  discord: { 
    points: 1, 
    maxPoints: 1, 
    isOneTime: true,
    description: "Discord username"
  },
  portfolio_website: { 
    points: 5, 
    maxPoints: 5, 
    isOneTime: true,
    description: "Portfolio website"
  },
  
  // Skills and experience (can have multiple)
  tech_stacks: { 
    pointsPerItem: 2, 
    maxPoints: 20, 
    maxItems: 10,
    isOneTime: false,
    description: "Technical skills (2 points each, max 10 skills)"
  },
  work_experience: { 
    pointsPerItem: 8, 
    maxPoints: 40, 
    maxItems: 5,
    isOneTime: false,
    description: "Work experience (8 points each, max 5 experiences)"
  },
  education: { 
    pointsPerItem: 6, 
    maxPoints: 24, 
    maxItems: 4,
    isOneTime: false,
    description: "Education entries (6 points each, max 4 entries)"
  },
  positions: { 
    pointsPerItem: 3, 
    maxPoints: 15, 
    maxItems: 5,
    isOneTime: false,
    description: "Job positions/roles (3 points each, max 5 positions)"
  },
  years_of_experience: { 
    points: 5, 
    maxPoints: 5, 
    isOneTime: true,
    description: "Years of experience field"
  }
};

// Calculate maximum possible points
const MAX_POSSIBLE_POINTS = Object.values(POINT_RULES).reduce(
  (total, rule) => total + rule.maxPoints, 
  0
);

// Enhanced helper function to check if a field is filled and meets requirements
function isFieldFilled(value: any, fieldName?: string): boolean {
  if (value === null || value === undefined) return false;
  
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length === 0) return false;
    
    // Check minimum length requirement for specific fields
    if (fieldName && POINT_RULES[fieldName]?.minLength) {
      return trimmed.length >= POINT_RULES[fieldName].minLength;
    }
    
    return true;
  }
  
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

// Helper function to calculate points for array fields with limits
function calculateArrayPoints(
  items: any[] | null,
  rule: typeof POINT_RULES[keyof typeof POINT_RULES]
): number {
  if (!items || !Array.isArray(items) || items.length === 0) return 0;
  
  const itemCount = rule.maxItems ? Math.min(items.length, rule.maxItems) : items.length;
  const totalPoints = itemCount * (rule.pointsPerItem || 0);
  
  return Math.min(totalPoints, rule.maxPoints);
}

// Helper function to get profile completion percentage
function calculateCompletionPercentage(earnedPoints: number): number {
  return Math.round((earnedPoints / MAX_POSSIBLE_POINTS) * 100);
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

    // Fetch comprehensive profile data from the codev table
    const { data: codevData, error: codevError } = await supabase
      .from("codev")
      .select(`
        id, image_url, tech_stacks, about, phone_number, address,
        github, facebook, linkedin, discord, portfolio_website,
        positions, years_of_experience
      `)
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
      .select("id, position, company_name, date_from, date_to, is_present")
      .eq('codev_id', validCodevId);

    if (workExpError) {
      console.error("Error fetching work experiences:", workExpError);
    }

    // Fetch education data from education table
    const { data: educationData, error: educationError } = await supabase
      .from("education")
      .select("id, institution, degree, start_date, end_date")
      .eq('codev_id', validCodevId);

    if (educationError) {
      console.error("Error fetching education data:", educationError);
    }

    // Calculate points and prepare data to insert/update
    const pointsToInsert: ProfilePointInsert[] = [];
    let totalPoints = 0;
    const completionDetails: Record<string, any> = {};

    // Process one-time fields from POINT_RULES
    for (const [field, rule] of Object.entries(POINT_RULES)) {
      if (rule.isOneTime && codevData.hasOwnProperty(field)) {
        if (isFieldFilled(codevData[field], field)) {
          pointsToInsert.push({
            codev_id: validCodevId,
            category: field,
            points: rule.points,
          });
          totalPoints += rule.points;
          completionDetails[field] = {
            completed: true,
            points: rule.points,
            maxPoints: rule.maxPoints
          };
        } else {
          completionDetails[field] = {
            completed: false,
            points: 0,
            maxPoints: rule.maxPoints,
            description: rule.description
          };
        }
      }
    }

    // Handle tech_stacks with enhanced logic
    if (codevData.tech_stacks) {
      const techStacksRule = POINT_RULES.tech_stacks;
      const points = calculateArrayPoints(codevData.tech_stacks, techStacksRule);
      
      if (points > 0) {
        pointsToInsert.push({
          codev_id: validCodevId,
          category: 'tech_stacks',
          points: points,
        });
        totalPoints += points;
      }
      
      completionDetails.tech_stacks = {
        completed: points > 0,
        points: points,
        maxPoints: techStacksRule.maxPoints,
        itemCount: Array.isArray(codevData.tech_stacks) ? codevData.tech_stacks.length : 0,
        maxItems: techStacksRule.maxItems,
        description: techStacksRule.description
      };
    }

    // Handle work experiences with enhanced logic
    if (workExperiences) {
      const workExpRule = POINT_RULES.work_experience;
      const points = calculateArrayPoints(workExperiences, workExpRule);
      
      if (points > 0) {
        pointsToInsert.push({
          codev_id: validCodevId,
          category: 'work_experience',
          points: points,
        });
        totalPoints += points;
      }
      
      completionDetails.work_experience = {
        completed: points > 0,
        points: points,
        maxPoints: workExpRule.maxPoints,
        itemCount: workExperiences.length,
        maxItems: workExpRule.maxItems,
        description: workExpRule.description
      };
    }

    // Handle education with new logic
    if (educationData) {
      const educationRule = POINT_RULES.education;
      const points = calculateArrayPoints(educationData, educationRule);
      
      if (points > 0) {
        pointsToInsert.push({
          codev_id: validCodevId,
          category: 'education',
          points: points,
        });
        totalPoints += points;
      }
      
      completionDetails.education = {
        completed: points > 0,
        points: points,
        maxPoints: educationRule.maxPoints,
        itemCount: educationData.length,
        maxItems: educationRule.maxItems,
        description: educationRule.description
      };
    }

    // Handle positions array
    if (codevData.positions) {
      const positionsRule = POINT_RULES.positions;
      const points = calculateArrayPoints(codevData.positions, positionsRule);
      
      if (points > 0) {
        pointsToInsert.push({
          codev_id: validCodevId,
          category: 'positions',
          points: points,
        });
        totalPoints += points;
      }
      
      completionDetails.positions = {
        completed: points > 0,
        points: points,
        maxPoints: positionsRule.maxPoints,
        itemCount: Array.isArray(codevData.positions) ? codevData.positions.length : 0,
        maxItems: positionsRule.maxItems,
        description: positionsRule.description
      };
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

    // Calculate profile completion percentage
    const completionPercentage = calculateCompletionPercentage(totalPoints);
    
    return NextResponse.json({
      success: true,
      totalPoints,
      maxPossiblePoints: MAX_POSSIBLE_POINTS,
      completionPercentage,
      pointsCount: savedPoints?.length || 0,
      points: savedPoints,
      breakdown: pointsToInsert,
      completionDetails,
      summary: {
        profileSections: {
          basicInfo: {
            completed: completionDetails.image_url?.completed || completionDetails.about?.completed || completionDetails.phone_number?.completed,
            points: (completionDetails.image_url?.points || 0) + (completionDetails.about?.points || 0) + (completionDetails.phone_number?.points || 0) + (completionDetails.address?.points || 0),
            maxPoints: 12 // 5+3+2+2
          },
          socialLinks: {
            completed: completionDetails.github?.completed || completionDetails.linkedin?.completed || completionDetails.portfolio_website?.completed,
            points: (completionDetails.github?.points || 0) + (completionDetails.linkedin?.points || 0) + (completionDetails.portfolio_website?.points || 0) + (completionDetails.facebook?.points || 0) + (completionDetails.discord?.points || 0),
            maxPoints: 11 // 2+2+5+1+1
          },
          professionalInfo: {
            completed: completionDetails.tech_stacks?.completed || completionDetails.work_experience?.completed || completionDetails.education?.completed,
            points: (completionDetails.tech_stacks?.points || 0) + (completionDetails.work_experience?.points || 0) + (completionDetails.education?.points || 0) + (completionDetails.positions?.points || 0) + (completionDetails.years_of_experience?.points || 0),
            maxPoints: 104 // 20+40+24+15+5
          }
        },
        datacounts: {
          workExperiences: workExperiences?.length || 0,
          educationEntries: educationData?.length || 0,
          techSkills: Array.isArray(codevData.tech_stacks) ? codevData.tech_stacks.length : 0,
          positions: Array.isArray(codevData.positions) ? codevData.positions.length : 0
        }
      }
    });

  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}