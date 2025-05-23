"use server"

import { createClientServerComponent } from "@/utils/supabase/server"




export const updateBooleanField = async (id: string | undefined, name: string, newState: boolean) => {
  const supabase = await createClientServerComponent()
  const { data, error } = await supabase
    .from('user_type') 
    .update({ [name]: newState })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  return data
}