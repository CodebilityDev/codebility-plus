import { NextRequest, NextResponse } from "next/server";
import { createClientServerComponent } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'active';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const supabase = await createClientServerComponent();
    
    // Get total count
    const { count } = await supabase
      .from("job_listings")
      .select("*", { count: 'exact', head: true })
      .eq("status", status);

    // Get paginated data
    const { data, error } = await supabase
      .from("job_listings")
      .select(`
        *,
        created_by:codev!created_by(id, first_name, last_name)
      `)
      .eq("status", status)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching job listings:", error);
      return NextResponse.json(
        { error: "Failed to fetch job listings" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      data: data || [],
      totalCount: count || 0,
      currentPage: page,
      totalPages: Math.ceil((count || 0) / limit)
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClientServerComponent();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("job_listings")
      .insert({
        ...body,
        created_by: user.id
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating job listing:", error);
      return NextResponse.json(
        { error: "Failed to create job listing" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}