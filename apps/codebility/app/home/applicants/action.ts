"use server";

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";
import { revalidatePath } from "next/cache";

const supabase = getSupabaseServerActionClient();

export const rejectAction = async (email_address: string) => {
  
    try {
      const { data: applicants, error: fetchError } = await supabase
        .from('applicants')
        .select('*')
        .eq('email_address', email_address)
  
      if (fetchError) throw fetchError;
  
      const { error: insertError } = await supabase
        .from('applicants_denied')
        .insert(applicants); 
  
      if (insertError) throw insertError;
      
       const { error: deleteError } = await supabase
       .from('applicants')
       .delete()
       .in('email_address', applicants.map(item => item.email_address)); 
  
      if (deleteError) throw deleteError;
      
      revalidatePath('/home/applicantsv2')
      return { success: true };
    } catch (error) {
      console.error('Error transferring data:', error);
      return { success: false, error: error};
    }
  };
  
  export const approveAction = async (email_address: string) => {
    try {
      const { data: applicants, error: fetchError } = await supabase
        .from('applicants')
        .select('*')
        .eq('email_address', email_address)
  
      if (fetchError) throw fetchError;
  
      const { error: insertError } = await supabase
        .from('applicants_accepted')
        .insert(applicants); 
  
      if (insertError) throw insertError;
      
       const { error: deleteError } = await supabase
       .from('applicants')
       .delete()
       .in('email_address', applicants.map(item => item.email_address)); 
  
      if (deleteError) throw deleteError;
  
      revalidatePath('/home/applicantsv2')
      return { success: true };
    } catch (error) {
      console.error('Error transferring data:', error);
      return { success: false, error: error};
    }
  }