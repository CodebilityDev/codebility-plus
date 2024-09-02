
'use server';

import { z } from 'zod';
import { createClient } from "@/utils/supabase/server";



export default async function InsertData(e: FormData) {

    const supabase = createClient();

       // Get form data
    const project_name = e.get("project_name")?.toString();
    const summary = e.get("summary")?.toString();
    const figma_link = e.get("project_thumbnail")?.toString();
    const live_link = e.get("live_link")?.toString();
    const github_link = e.get("github_link")?.toString();
    const file = e.get("file") as File;


    if (!project_name || !summary || !figma_link || !live_link || !github_link || !file) return;

    // Extract the file extension (e.g., .png, .jpg)
  const fileExtension = file.name.split('.').pop();

  // Create a unique file name using the original name, a timestamp, and the extension
  const uniqueFileName = `${file.name.split('.')[0]}_${Date.now()}.${fileExtension}`;


    // Convert file into a buffer (server-side handling)
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload the file as binary data to Supabase Storage
    const { error: uploadError } = await supabase
      .storage
      .from('project-images') // Replace with your bucket name
      .upload(`images/${uniqueFileName}`, buffer, {
        contentType: file.type, // Set the content type based on the file's type
      upsert: true
    },);

    if (uploadError) {
      console.error('Error uploading file:', uploadError.message);
      return;
    }

    
     //  Construct the full public URL
       const baseUrl = "https://kdkuljweiqtiveqvqirw.supabase.co/storage/v1/object/public";
       const bucketName = "project-images";
       const fullUrl = `${baseUrl}/${bucketName}/images/${uniqueFileName}`;


    if (!fullUrl) return;

    // Insert the project data into the database
    const newProject = {
      name: project_name,
      summary: summary,
      figma_link: figma_link,
      live_link: live_link,
      github_link: github_link,
      thumbnail: fullUrl,
    };

    const { error: insertError } = await supabase
      .from('project') // Assuming your table name is 'projects'
      .insert([newProject]);

    if (insertError) {
      console.error('Error inserting data:', insertError);
    } else {
      console.log('Data inserted successfully');
    }

   
  }