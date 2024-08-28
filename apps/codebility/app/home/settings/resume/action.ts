"use server"

import { createServer } from "@/utils/supabase";

export async function getPronouns() {
    const supabase = createServer()
    const { data, error} = await supabase.rpc('get_enum_values', {
        enum_name: 'Pronoun',
        schema_name: 'public',
     })
     console.log(error)
     console.log(data)
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
    return supabase.from("work_experience").select().eq("id", user?.id).single()
}
export async function createWorkExperience(createWorkExp: any) {
    const supabase = createServer()
    const {data: {user}} = await supabase.auth.getUser()
    return supabase.from("work_experience").update(createWorkExp).eq("id", user?.id).select()
}
export async function updateWorkExperience(updateWorkExp: any) {
    const supabase = createServer()
    const {data: {user}} = await supabase.auth.getUser()
    const {data} = await supabase.from("work_experience").update(updateWorkExp).eq("id", user?.id).select()
}
export async function deleteWorkExperience(workExperienceId: string){
    const supabase = createServer()
    const {data: {user}} = await supabase.auth.getUser()
    const {data, error} = await supabase.from("work_experience").delete().eq("id", workExperienceId).eq("user_id", user?.id)
}