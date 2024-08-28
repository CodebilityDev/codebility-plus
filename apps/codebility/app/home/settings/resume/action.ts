"use server"

import { createServer } from "@/utils/supabase";
import { object } from "zod";

export async function getPronouns() {
    const supabase = createServer()
    const { data, error} = await supabase.rpc('get_enum_values', {
        enum_name: 'pronoun',
        schema_name: 'public',
     })
    return data
    
  }
export async function updateProfile(updatedData: any) {
    const supabase = createServer()
    const {data: {user} } = await supabase.auth.getUser()
    const {data} = await supabase.from("resume").update(updatedData).eq("id", user?.id).select()
    console.log(data)
}
export async function getProfile() {
    const supabase = createServer()
    const {data: {user} } = await supabase.auth.getUser()

    return supabase.from("resume").select().eq("id", user?.id).single()
   
}
export async function getWorkExperience() {
    const supabase = createServer()
    const {data: {user}} = await supabase.auth.getUser()
    return supabase.from("experience").select().eq("id", user?.id).single()
}
export async function createWorkExperience(createWorkExp: any) {
    const supabase = createServer()
    const {data: {user}} = await supabase.auth.getUser()
    const workExperience = Object.assign(createWorkExp, {resume_id: user?.id })
    return supabase.from("experience").insert(workExperience)
}

export async function updateWorkExperience(updateWorkExp: any) {
    const supabase = createServer()
    const {data: {user}} = await supabase.auth.getUser()
    const {data} = await supabase.from("experience").update(updateWorkExp).eq("resume_id", user?.id).select()
}
export async function deleteWorkExperience(workExperienceId: any){
    const supabase = createServer()
    const {data: {user}} = await supabase.auth.getUser()
    const {data, error} = await supabase.from("experience").delete().eq("id", workExperienceId).eq("user_id", user?.id)
}