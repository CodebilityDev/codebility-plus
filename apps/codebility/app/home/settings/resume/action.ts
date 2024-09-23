/* eslint-disable no-unused-vars */
"use server"


import { Profile_Types, Social_Types } from "./_types/resume";
import { Experience_Type } from "./_components/resume-experience";
import toast from "react-hot-toast";
import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";


const supabase = getSupabaseServerComponentClient()
export async function uploadAvatar(file: File) {
    if (!file) return null;
  
    const bucket = "profiles";
    const filePath = `avatars/${file.name}`;
  
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);
  
    if (uploadError) {
      console.error("Error uploading file:", uploadError.message);
      toast.error("Error uploading file");
      return null;
    }
  
  }
  
export async function removeAvatar(avatar: string | null ): Promise<void>{
    if(avatar === null) return 
    const fileName = avatar.split("/").pop();
    const filePath = `avatars/${fileName}`;
    const { error } = await supabase.storage
      .from("profiles")
      .remove([filePath]);
      if (error) {
        console.error("Error removing file:", error.message);
        throw new Error("Error removing file");
      }
}
export async function updateProfile(updatedData: Profile_Types) {
    const {data: {user}} = await supabase.auth.getUser()
    const {data, error} = await supabase.from("profile").update({...updatedData, id: user?.id }).eq("user_id", user?.id).select("*")
}
export async function updateSocial(updatedData: Social_Types) {
    const {data: {user}} = await supabase.auth.getUser()
    const {data, error} = await supabase.from("social").update(updatedData).eq("user_id", user?.id).select("*")
}
export async function createWorkExperience(createWorkExp: Experience_Type[]) {
  const {data: {user}} = await supabase.auth.getUser()
  const workExperience = { ...createWorkExp, profile_id: user?.id };
  const {data, error} = await supabase.from("experiences").insert(workExperience).eq("profile_id", user?.id).select()

  if (error) {
    throw error;
  }

  return data;
}
export async function updateWorkExperience( id: string, expData: Experience_Type) {
  const {data: {user}} = await supabase.auth.getUser()
 return await supabase.from("experiences").update(expData).eq("profile_id", user?.id).eq("id", id)
}
export async function deleteWorkExperience(id: string){
    const {data: {user}} = await supabase.auth.getUser()
   return await supabase.from("experiences").delete().eq("profile_id", user?.id).eq("id", id)
}
