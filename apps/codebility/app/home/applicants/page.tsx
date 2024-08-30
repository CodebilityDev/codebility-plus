import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client"
import ApplicantsList from "@/app/home/applicants/_components/applicants-list"
import { ApplicantsList_Types } from "@/app/home/applicants/_types/applicants"

const ApplicantsPage = async () => {

  const supabase = getSupabaseServerComponentClient();
  const { data: applicants, error } = await supabase
    .from("applicants")
    .select('*')


  return (
    <div className="max-w-screen-xl mx-auto flex flex-col gap-4">
      {
        error ?
          <div>ERROR</div>
          :
          <ApplicantsList applicants={applicants as ApplicantsList_Types[]} />
      }
    </div>
  )
}

export default ApplicantsPage
