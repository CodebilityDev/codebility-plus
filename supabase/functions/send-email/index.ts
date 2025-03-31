// Use this import for Supabase Edge Functions
// @ts-ignore: Deno-specific imports
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
// @ts-ignore: Deno-specific imports
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

// List of allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://hibnlysaokybrsufrdwp.supabase.co"
];

// Use serve instead of Deno.serve for compatibility
serve(async (req) => {
  // Get the request origin
  const origin = req.headers.get("Origin") || "";
  
  // Set CORS headers based on origin
  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",  // 24 hours caching for preflight
  };

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const { recipient, subject, content } = await req.json();
    
    // For testing, just log the request and return success
    console.log(`Email request received for: ${recipient}`);
    
    // Return response with CORS headers
    return new Response(JSON.stringify({ 
      success: true,
      message: `Would send email to ${recipient}` 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error("Email sending error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
});