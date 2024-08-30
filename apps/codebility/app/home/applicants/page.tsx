import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client"
const ApplicantsPage = async () => {

  const supabase = getSupabaseServerComponentClient();
  const { data: applicants, error } = await supabase
    .from("applicants")
    .select('*')


  return (
    <div className="max-w-screen-xl mx-auto flex flex-col gap-4">

    </div>
  )
}

export default ApplicantsPage
