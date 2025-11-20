// app/api/delete-auth-user/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Define request body type for type safety
interface DeleteUserRequest {
  userId: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body with type assertion
    const body = await request.json() as DeleteUserRequest;
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Create Supabase client with service role key
    // IMPORTANT: Service role key should ONLY be used server-side
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.DB_SERVICE_ROLE!, // Using your environment variable name
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Verify the user making the request
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'No authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: verifyError } = await supabaseAdmin.auth.getUser(token);

    if (verifyError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Ensure user can only delete their own account
    if (user.id !== userId) {
      return NextResponse.json(
        { error: 'Forbidden: You can only delete your own account' },
        { status: 403 }
      );
    }

    // Delete the user from Supabase Auth
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete user authentication' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'User authentication deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}