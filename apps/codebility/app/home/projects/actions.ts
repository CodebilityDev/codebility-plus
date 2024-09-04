
'use server';

import { z } from 'zod';
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from 'next/cache';


// const deleteImageByPublicUrl = async (publicUrl: string) => {

//   const supabase = createClient();

//   // Extract the file path from the public URL
//   const baseUrl = 'https://nwpvsxbrftplvebseaas.supabase.co/storage/v1/object/public/project-images/';
//   const filePath = publicUrl.replace(baseUrl, '');

//   if (filePath) {
//     // Remove the file from storage
//     const { error } = await supabase
//       .storage
//       .from('project-images') // Replace with your bucket name
//       .remove([filePath]);

//     if (error) {
//       console.error('Error deleting image:', error.message);
//     } else {
//       console.log('Image deleted successfully');
//     }
//   } else {
//     console.error('Failed to extract file path from public URL');
//   }
// };


const deleteImageByPublicUrl = async (publicUrlOrFilePath: string | null | undefined) => {
  const supabase = createClient();

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


// Example usage
// const imageUrl = 'https://nwpvsxbrftplvebseaas.supabase.co/storage/v1/object/public/project-images/images/apple-test_1725333722227.png';
// deleteImageByPublicUrl(imageUrl);

export async function uploadImage(file: File): Promise<string | null> {


  const supabase = createClient();

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


export  async function InsertData(e: FormData) {

    const supabase = createClient();

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
    };

    const { error: insertError } = await supabase
      .from('project') // Assuming your table name is 'projects'
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
    };

    const { error: insertError } = await supabase
      .from('project') // Assuming your table name is 'projects'
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

    const supabase = createClient();


    const { data, error } = await supabase
      .from('project') // Replace with your table name
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

    const supabase = createClient();


     // Get form data
     const project_name = e.get("project_name")?.toString();
     const summary = e.get("summary")?.toString();
     const figma_link = e.get("project_thumbnail")?.toString();
     const live_link = e.get("live_link")?.toString();
     const github_link = e.get("github_link")?.toString();
     const clientId = e.get("clientId")?.toString();



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
    .from('project') // Replace with your table name
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
    .from('project') // Replace with your table name
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

    const supabase = createClient();

    const { error: deleteError } = await supabase
      .from('project') // Replace with your table name
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


 
 
// const FormSchema = z.object({
//   id: z.string(),
//   customerId: z.string(),
//   amount: z.coerce.number(),
//   status: z.enum(['pending', 'paid']),
//   date: z.string(),
// });
 
// const CreateInvoice = FormSchema;
 
// export async function createInvoice(formData: FormData) {
//   // ...

//   const { customerId, amount, status } = CreateInvoice.parse({
//     customerId: formData.get('customerId'),
//     amount: formData.get('amount'),
//     status: formData.get('status'),
//   });

  

// }