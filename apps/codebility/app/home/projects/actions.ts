
'use server';

import { revalidatePath } from 'next/cache';
import { User } from '@/types';


import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

const deleteImageByPublicUrl = async (publicUrlOrFilePath: string | null | undefined) => {

  
  const supabase = getSupabaseServerComponentClient();

  // Define the base URL
  const baseUrl = 'https://nwpvsxbrftplvebseaas.supabase.co/storage/v1/object/public/project-images/';

  // Check if the input is null, undefined, or doesn't contain the base URL
  if (!publicUrlOrFilePath || !publicUrlOrFilePath.startsWith(baseUrl)) {
    console.log('No valid URL provided or URL does not match the base URL. Skipping deletion.');
    return;  // Exit the function if conditions are not met
  }

  // Extract the file path from the full URL
  const filePath = publicUrlOrFilePath.replace(baseUrl, '');

  // Proceed with file deletion
  if (filePath) {
    const { error } = await supabase
      .storage
      .from('project-images') // Replace with your bucket name
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error.message);
    } else {
      console.log('Image deleted successfully');
    }
  } else {
    console.error('Failed to extract file path from public URL');
  }
};



export async function uploadImage(file: File): Promise<string | null> {


  const supabase = getSupabaseServerComponentClient();

  if (!file) return null;

  const fileExtension = file.name.split('.').pop();
  const uniqueFileName = `${file.name.split('.')[0]}_${Date.now()}.${fileExtension}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase
    .storage
    .from('project-images') // Replace with your bucket name
    .upload(`images/${uniqueFileName}`, buffer, {
      contentType: file.type,
      upsert: true
    });

  if (uploadError) {
    console.error('Error uploading file:', uploadError.message);
    return null;
  }

  const { data } = supabase.storage.from('project-images').getPublicUrl(`images/${uniqueFileName}`);
  return data?.publicUrl || null;
}





export async function DeleteProjectMembers(e: FormData, newMembers: User[]) {

  const supabase = getSupabaseServerComponentClient();

  const user_id_search = e.get("userId")?.toString();

  if (!user_id_search) return;

  // Step 1: Fetch the existing project data (including members)
  const { data: projectData, error } = await supabase
    .from('projects')
    .select('members')
    .eq('id', user_id_search)
    .single();

  if (error) {
    console.error('Error fetching project:', error.message);
    return;
  }

  // Step 2: Parse the existing members (if they are stored as a JSON string)
  let existingMembers: User[] = [];
  if (projectData?.members) {
    existingMembers = projectData.members.map((member: string) => JSON.parse(member));
  }

  // Step 3: Determine the IDs of members to remove
  const idsToRemove = newMembers.map(member => member.id);

  // Filter out members whose IDs are in the `idsToRemove` array
  const updatedMembers = existingMembers.filter(
    (member) => !idsToRemove.includes(member.id)
  );

  // Step 4: Stringify the updated members array before updating the project
  const updatedMembersStringified = updatedMembers.map((member) => JSON.stringify(member));

  // Step 5: Update the project with the filtered members
  const { error: updateError } = await supabase
    .from('projects')
    .update({ members: updatedMembersStringified })
    .eq('id', user_id_search);

  if (updateError) {
    console.error('Error updating project:', updateError.message);
    return;
  }

  console.log('Members successfully updated in the project!');
  // Optional: Revalidate path or perform other actions
  revalidatePath('/home/projects');
}


export async function InsertTeamLeader(e: FormData, newMembers: User[]) {





  const supabase = getSupabaseServerComponentClient();



  const user_id_search = e.get("userId")?.toString();

    if(!user_id_search) return



  // Step 1: Fetch the existing project data (including members)
  const { data: projectData, error } = await supabase
    .from('projects')
    .select('members')
    .eq('id', user_id_search)
    .single();

  if (error) {
    console.error('Error fetching project:', error.message);
    return;
  }

  // Step 2: Parse the existing members (if they are stored as a JSON string)
  let existingMembers: User[] = [];
  if (projectData?.members) {
    existingMembers = projectData.members.map((member: string) => JSON.parse(member));
  }

   // Step 3: Filter out new members that are already in the existing members
   const updatedMembers = [
    ...existingMembers,
    ...newMembers.filter((newMember) => 
      !existingMembers.some((existingMember) => existingMember.id === newMember.id)
    ).map((member) => ({
      id: member.id,
      first_name: member.first_name,
      last_name: member.last_name,
      image_url: member.image_url,
      position: member.main_position,
    })),
  ];

  // Step 4: Stringify the updated members array before updating the project
  const updatedMembersStringified = updatedMembers.map((member) => JSON.stringify(member));

  // Step 5: Update the project with the new members
  const { error: updateError } = await supabase
    .from('projects')
    .update({ members: updatedMembersStringified })
    .eq('id', user_id_search);

  if (updateError) {
    console.error('Error updating project:', updateError.message);
    return;
  }

  console.log('Members successfully added to the project!');
  revalidatePath('/home/projects')
}





  export  async function InsertData(e: FormData,selectedMembers: User[], teamLeaderId: string ,teamLeaderLastName: string)  {

    const supabase = getSupabaseServerComponentClient();



      // Extract data from selectedMembers
    const membersData = selectedMembers.map((member) => ({
      id: member.id,
      first_name: member.first_name,
      last_name: member.last_name,
      image_url: member.image_url,
      position: member.main_position // Array of positions
    }));



       // Get form data
    const project_name = e.get("project_name")?.toString();
    const summary = e.get("summary")?.toString();
    const figma_link = e.get("project_thumbnail")?.toString();
    const live_link = e.get("live_link")?.toString();
    const github_link = e.get("github_link")?.toString();
    const clientId = e.get("clientId")?.toString();
    const teamleaderId = e.get("team_leader_id")?.toString();
    const file = e.get("file") as File;


    const projectImageId = e.get("projectImageId")?.toString();


    if (!project_name || !summary || !figma_link || !live_link || !github_link || !file || !clientId || !teamleaderId) return;


    if(!projectImageId){

      console.log("no image is selected")


    // Insert the project data into the database
    const newProject = {
      name: project_name,
     summary: summary,
     figma_link: figma_link,
      live_link: live_link,
     github_link: github_link,
     client_id: clientId,
     members: membersData,
     team_leader_id: teamleaderId,
     view_type: {
      first_name: teamLeaderId,
      last_name: teamLeaderLastName,
     }
    };

    const { error: insertError } = await supabase
      .from('projects') // Assuming your table name is 'projects'
      .insert([newProject]);

    if (insertError) {
      console.error('Error inserting data:', insertError);
    } else {
      console.log('Data inserted successfully');
      revalidatePath('/home/projects')

    }
   



    }else{



      // Upload the image and get its public URL
  const uploadedImageUrl = await uploadImage(file);

    if (!uploadedImageUrl) return;

    // Insert the project data into the database
    const newProject = {
      name: project_name,
     summary: summary,
     figma_link: figma_link,
      live_link: live_link,
     github_link: github_link,
     thumbnail: uploadedImageUrl,
     client_id: clientId,
     members: membersData,
     team_leader_id: teamleaderId,
     view_type: {
      first_name: teamLeaderId,
      last_name: teamLeaderLastName,
     }
    };

    const { error: insertError } = await supabase
      .from('projects') // Assuming your table name is 'projects'
      .insert([newProject]);

    if (insertError) {
      console.error('Error inserting data:', insertError);
    } else {
      console.log('Data inserted successfully');
      revalidatePath('/home/projects')

    }





    }


    
   
  }



  // Create Supabase client
  
  const selectProjectById = async (projectId: string) => {

    const supabase = getSupabaseServerComponentClient();


    const { data, error } = await supabase
      .from('projects') // Replace with your table name
      .select('thumbnail') // Select specific fields you want
      .eq('id', projectId); // Filter by id
  

    if (data && data.length > 0) {



      return data[0]?.thumbnail
       
      
    } else {
      console.log('No project found with the given id.');
      return null; // Return null if no data is found
    }

  };



  
  

  // Example usage
// const projectId = 'your-project-id'; // Replace with the specific id you want to search
// selectProjectById(projectId);



  export async function UpdateData(e: FormData) {

    const supabase = getSupabaseServerComponentClient();


    let fetch_name = ""
    let fetch_summary = ""
    let fetch_figma_link = ""
    let fetch_live_link = ""
    let fetch_github_link = ""
    let fetch_client_id = ""


    const user_id_search = e.get("userId")?.toString();

    if(!user_id_search) return


    const { data, error } = await supabase
    .from('projects') // Replace with your table name
    .select('*') // Select specific fields you want
    .eq('id', user_id_search); // Filter by id


  if (data && data.length > 0) {

    fetch_name = data[0].name; // Get the first matching project
    fetch_summary = data[0].summary; // Get the first matching project
    fetch_figma_link = data[0].figma_link; // Get the first matching project
    fetch_live_link = data[0].live_link;
    fetch_github_link = data[0].github_link;
    fetch_client_id = data[0].client_id;

    
  } else {
    console.log('No project found with the given id.');
    return null; // Return null if no data is found
  }




     // Get form data
     const project_name = e.get("project_name")?.toString().trim() || fetch_name;
     const summary = e.get("summary")?.toString().trim() || fetch_summary;
     const figma_link = e.get("project_thumbnail")?.toString().trim() || fetch_figma_link;
     const live_link = e.get("live_link")?.toString().trim() || fetch_live_link;
     const github_link = e.get("github_link")?.toString().trim() || fetch_github_link;
     const clientId = e.get("clientId")?.toString().trim() || fetch_client_id;




    const user_id = e.get("userId")?.toString();
    const file = e.get("file") as File;
    const projectImageId = e.get("projectImageId")?.toString();



    if(!projectImageId){

      console.log("no image is selected")

       // Insert the project data into the database
    const updatedProject = {
      name: project_name,
     summary: summary,
     figma_link: figma_link,
     live_link: live_link,
     github_link: github_link,
    client_id: clientId,
    };

    const { error: updateError } = await supabase
    .from('projects') // Replace with your table name
    .update(updatedProject) // Pass the updated data
    .eq('id', user_id); // Specify which row to update by id

  if (updateError) {
    console.error('Error updating data:', updateError.message);
  } else {

    console.log('Data updated successfully');
    revalidatePath('/home/projects')
  }




    }else{


      console.log("Image is selected")


      if (!user_id ) return;

    const thumbnailId = await selectProjectById(user_id);
    await deleteImageByPublicUrl(thumbnailId);



      // Upload the image and get its public URL
      const uploadedImageUrl = await uploadImage(file);



   if (!uploadedImageUrl) return;

    // Insert the project data into the database
    const updatedProject = {
      name: project_name,
      thumbnail: uploadedImageUrl,
      summary: summary,
      figma_link: figma_link,
       live_link: live_link,
      github_link: github_link,
      client_id: clientId,
    };

    const { error: updateError } = await supabase
    .from('projects') // Replace with your table name
    .update(updatedProject) // Pass the updated data
    .eq('id', user_id); // Specify which row to update by id

  if (updateError) {
    console.error('Error updating data:', updateError.message);
  } else {

    console.log('Data updated successfully');
    revalidatePath('/home/projects')
  }


    }

      


  }

  const deleteProject = async (projectId: string) => {

    const supabase = getSupabaseServerComponentClient();

    const { error: deleteError } = await supabase
      .from('projects') // Replace with your table name
      .delete() // Perform the delete operation
      .eq('id', projectId); // Specify which row to delete by id
  
    if (deleteError) {
      console.error('Error deleting data:', deleteError.message);
    } else {
      console.log('Data deleted successfully');
    }
  };


  export async function DeleteData(e: FormData) {


    const user_id = e.get("userId")?.toString();

    // console.log(user_id)

    if (!user_id) return;

    const thumbnailId = await selectProjectById(user_id);
    await deleteImageByPublicUrl(thumbnailId);
    await deleteProject(user_id)

    revalidatePath('/home/projects')


  }


 
 