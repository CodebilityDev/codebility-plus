"use server"

import { getSupabaseServerComponentClient } from '@codevs/supabase/server-component-client';

const supabase = getSupabaseServerComponentClient();


export const updateBooleanField = async (id: string | undefined, name: string, newState: boolean) => {
  const { data, error } = await supabase
    .from('user_type') 
    .update({ [name]: newState })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  return data
}