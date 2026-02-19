"use server";

import { createClientServerComponent } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export interface ClientOutreach {
  id: string;
  admin_id: string;
  client_name: string;
  client_email: string | null;
  client_company: string | null;
  outreach_date: string;
  notes: string | null;
  week_start: string;
  created_at: string;
}

export interface AdminOutreachStats {
  admin_id: string;
  first_name: string;
  last_name: string;
  email_address: string;
  current_week_count: number;
  total_count: number;
}

/**
 * Get current week's start date (Monday)
 */
export function getCurrentWeekStart(): Date {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If Sunday, go back 6 days, else go to Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/**
 * Get all admins with their outreach counts for the current week
 */
export async function getAdminOutreachStats(): Promise<{
  success: boolean;
  data?: AdminOutreachStats[];
  error?: string;
}> {
  try {
    const supabase = await createClientServerComponent();

    // Get current user to verify they're an admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify user is admin
    const { data: isAdminData } = await supabase
      .rpc('is_admin', { user_id: user.id });

    if (!isAdminData) {
      return { success: false, error: "Unauthorized: Admin access required" };
    }

    // Get current week start
    const weekStart = getCurrentWeekStart().toISOString().split('T')[0];

    // Get all admins
    const { data: admins, error: adminsError } = await supabase
      .from('codev')
      .select('id, first_name, last_name, email_address')
      .eq('role_id', 1)
      .eq('application_status', 'passed')
      .order('first_name');

    if (adminsError) {
      return { success: false, error: adminsError.message };
    }

    // Get all outreach records for current week
    const { data: currentWeekOutreach, error: currentWeekError } = await supabase
      .from('client_outreach')
      .select('admin_id')
      .eq('week_start', weekStart);

    if (currentWeekError) {
      return { success: false, error: currentWeekError.message };
    }

    // Get total outreach counts per admin
    const { data: totalOutreach, error: totalError } = await supabase
      .from('client_outreach')
      .select('admin_id');

    if (totalError) {
      return { success: false, error: totalError.message };
    }

    // Count outreach per admin
    const currentWeekCounts = currentWeekOutreach?.reduce((acc, record) => {
      acc[record.admin_id] = (acc[record.admin_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    const totalCounts = totalOutreach?.reduce((acc, record) => {
      acc[record.admin_id] = (acc[record.admin_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    // Combine data
    const stats: AdminOutreachStats[] = admins?.map(admin => ({
      admin_id: admin.id,
      first_name: admin.first_name,
      last_name: admin.last_name,
      email_address: admin.email_address,
      current_week_count: currentWeekCounts[admin.id] || 0,
      total_count: totalCounts[admin.id] || 0,
    })) || [];

    return { success: true, data: stats };
  } catch (error) {
    console.error('Error fetching admin outreach stats:', error);
    return { success: false, error: 'Failed to fetch stats' };
  }
}

/**
 * Add a new client outreach record
 */
export async function addClientOutreach(formData: {
  client_name: string;
  client_email?: string;
  client_company?: string;
  notes?: string;
}): Promise<{
  success: boolean;
  data?: ClientOutreach;
  error?: string;
}> {
  try {
    const supabase = await createClientServerComponent();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify user is admin
    const { data: isAdminData } = await supabase
      .rpc('is_admin', { user_id: user.id });

    if (!isAdminData) {
      return { success: false, error: "Unauthorized: Admin access required" };
    }

    // Insert outreach record
    const { data, error } = await supabase
      .from('client_outreach')
      .insert({
        admin_id: user.id,
        client_name: formData.client_name,
        client_email: formData.client_email || null,
        client_company: formData.client_company || null,
        notes: formData.notes || null,
        outreach_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/home/admin-controls/client-tracker');
    return { success: true, data };
  } catch (error) {
    console.error('Error adding client outreach:', error);
    return { success: false, error: 'Failed to add outreach record' };
  }
}

/**
 * Get outreach history for a specific admin
 */
export async function getAdminOutreachHistory(
  adminId: string,
  weekStart?: string
): Promise<{
  success: boolean;
  data?: ClientOutreach[];
  error?: string;
}> {
  try {
    const supabase = await createClientServerComponent();

    // Get current user to verify they're an admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify user is admin
    const { data: isAdminData } = await supabase
      .rpc('is_admin', { user_id: user.id });

    if (!isAdminData) {
      return { success: false, error: "Unauthorized: Admin access required" };
    }

    let query = supabase
      .from('client_outreach')
      .select('*')
      .eq('admin_id', adminId)
      .order('outreach_date', { ascending: false });

    if (weekStart) {
      query = query.eq('week_start', weekStart);
    }

    const { data, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching outreach history:', error);
    return { success: false, error: 'Failed to fetch history' };
  }
}

/**
 * Delete an outreach record
 */
export async function deleteClientOutreach(outreachId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClientServerComponent();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Not authenticated" };
    }

    // Delete (RLS will ensure they can only delete their own)
    const { error } = await supabase
      .from('client_outreach')
      .delete()
      .eq('id', outreachId)
      .eq('admin_id', user.id); // Extra safety check

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/home/admin-controls/client-tracker');
    return { success: true };
  } catch (error) {
    console.error('Error deleting client outreach:', error);
    return { success: false, error: 'Failed to delete outreach record' };
  }
}
