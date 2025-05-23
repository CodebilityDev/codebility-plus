
import { createClientServerComponent } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClientServerComponent();
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the codev ID from the URL params
    const codevId = params.id;
    if (!codevId) {
      return NextResponse.json(
        { error: "Codev ID is required" },
        { status: 400 }
      );
    }

    // Fetch the NDA document from the database
    const { data, error } = await supabase
      .from("codev")
      .select("nda_document, first_name, last_name")
      .eq("id", codevId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Failed to fetch NDA document" },
        { status: 404 }
      );
    }

    if (!data.nda_document) {
      return NextResponse.json(
        { error: "NDA document not found for this codev" },
        { status: 404 }
      );
    }

    // Return the PDF document
    return NextResponse.json({
      document: data.nda_document,
      filename: `NDA_${data.first_name}_${data.last_name}.pdf`
    });
  } catch (error) {
    console.error("Error fetching NDA document:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}