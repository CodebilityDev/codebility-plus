"use server";

import { createClientServerComponent } from "@/utils/supabase/server";
import { deleteImage, getImagePath } from "@/utils/uploadImage";
import { z } from "zod";

const bannerSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  message: z.string().min(1, "Message is required"),
  type: z.enum(["info", "warning", "success", "error", "announcement"]),
  image_url: z.string().optional(),
  priority: z.number().min(1).max(100),
  is_active: z.boolean(),
  start_date: z.string(),
  end_date: z.string().optional(),
});

export async function createNewsBanner(formData: z.infer<typeof bannerSchema>) {
  try {
    const validatedData = bannerSchema.parse(formData);
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

    const bannerData = {
      title: validatedData.title,
      message: validatedData.message,
      type: validatedData.type,
      image_url: validatedData.image_url || null,
      priority: validatedData.priority,
      is_active: validatedData.is_active,
      start_date: new Date(validatedData.start_date).toISOString(),
      end_date: validatedData.end_date ? new Date(validatedData.end_date).toISOString() : null,
      created_by: user.user.id,
    };

    const { data, error } = await supabase
      .from("news_banners")
      .insert(bannerData)
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
    return { error: "Failed to create banner" };
  }
}

export async function updateNewsBanner(
  bannerId: string,
  formData: z.infer<typeof bannerSchema>
) {
  try {
    const validatedData = bannerSchema.parse(formData);
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

    const bannerData = {
      title: validatedData.title,
      message: validatedData.message,
      type: validatedData.type,
      image_url: validatedData.image_url || null,
      priority: validatedData.priority,
      is_active: validatedData.is_active,
      start_date: new Date(validatedData.start_date).toISOString(),
      end_date: validatedData.end_date ? new Date(validatedData.end_date).toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("news_banners")
      .update(bannerData)
      .eq("id", bannerId)
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
    return { error: "Failed to update banner" };
  }
}

export async function deleteNewsBanner(bannerId: string) {
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

    // First, get the banner to check if it has an image
    const { data: banner, error: fetchError } = await supabase
      .from("news_banners")
      .select("image_url")
      .eq("id", bannerId)
      .single();

    if (fetchError) {
      return { error: "Banner not found" };
    }

    // Delete the banner from database
    const { error: deleteError } = await supabase
      .from("news_banners")
      .delete()
      .eq("id", bannerId);

    if (deleteError) {
      return { error: deleteError.message };
    }

    // Clean up image from storage if it exists
    if (banner.image_url) {
      try {
        const imagePath = getImagePath(banner.image_url);
        if (imagePath) {
          await deleteImage(imagePath, "codebility");
        }
      } catch (imageError) {
        console.warn("Failed to delete banner image:", imageError);
        // Don't fail the whole operation if image deletion fails
      }
    }

    return { success: true };
  } catch (error) {
    return { error: "Failed to delete banner" };
  }
}

export async function toggleBannerStatus(bannerId: string, isActive: boolean) {
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
      .from("news_banners")
      .update({ 
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq("id", bannerId)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    return { data, success: true };
  } catch (error) {
    return { error: "Failed to update banner status" };
  }
}

export async function getActiveBanners() {
  try {
    const supabase = await createClientServerComponent();
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from("news_banners")
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
    return { error: "Failed to fetch banners" };
  }
}

export async function getAllBanners() {
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
      .from("news_banners")
      .select("*")
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      return { error: error.message };
    }

    return { data: data || [], success: true };
  } catch (error) {
    return { error: "Failed to fetch banners" };
  }
}