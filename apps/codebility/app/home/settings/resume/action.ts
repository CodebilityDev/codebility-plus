/* eslint-disable no-unused-vars */
"use server"

import { createServer } from "@/utils/supabase";


const supabase = createServer()

export async function updateProfile(updatedData: any ) {
    const {data: {user}} = await supabase.auth.getUser()
  const {data, error} = await supabase.from("profile").update({...updatedData, id: user?.id }).eq("id", user?.id).select()
}
export async function updateSocial(updatedData: any) {
    const {data: {user}} = await supabase.auth.getUser()
    const {data} = await supabase.from("social").update(updatedData).eq("id", user?.id).select()
  
}
export async function createWorkExperience(createWorkExp: any) {
    const {data: {user}} = await supabase.auth.getUser()
    const workExperience = { ...createWorkExp, profile_id: user.id };
//   const workExperience = Object.assign(createWorkExp, {profile_id: user?.id })
    return supabase.from("experience").insert(workExperience).eq("profile_id", user?.id).select()
   
}
export async function updateWorkExperience( id: string, expData: any) {
    const {data: {user}} = await supabase.auth.getUser()
    const {data, error} = await supabase.from("experience").update(expData).eq("id", id)
 
    return {data, error}
}
export async function deleteWorkExperience(workExperienceId: any){
    const {data: {user}} = await supabase.auth.getUser()
    return supabase.from("experience").delete().eq("id", workExperienceId)
}
