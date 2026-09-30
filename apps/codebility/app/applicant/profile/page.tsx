import H1 from "@/components/global/layout/H1";
import { createClientServerComponent } from "@/lib/global/supabase-server";
import { Toaster } from "react-hot-toast";

import About from "@/components/applicant/profile/About";
import ContactInfo from "@/components/applicant/profile/ContactInfo";
import Experience from "@/components/applicant/profile/Experience";
import EducationalBackground from "@/components/applicant/profile/EducationalBackground";
import JobStatuses from "@/components/applicant/profile/JobStatuses";
import PersonalInfo from "@/components/applicant/profile/PersonalInfo";
import Photo from "@/components/applicant/profile/Photo";
import Skills from "@/components/applicant/profile/Skills";
import TimeSchedule from "@/components/applicant/profile/TimeSchedule";
import { ProfilePointsGate } from "@/components/applicant/profile/ProfilePointsGate";
import ProfileCompletionGuide from "@/components/applicant/profile/ProfileCompletionGuide";

export const instant = false;

// Prevent static generation at build time

function earnedCategories(points: { points: { category: string; points: number }[] } | null): string[] {
  if (!points) return [];
  return points.points
    .filter((entry) => entry.points > 0)
    .map((entry) => entry.category);
}

export default async function ApplicantProfilePage() {
  return <ProfileComponent />;
}

async function ProfileComponent() {
  const supabase = await createClientServerComponent();

  // Get current user
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Please log in to view your profile.</div>
      </div>
    );
  }

  // Fetch user profile data
  const { data: user, error: userError } = await supabase
    .from("codev")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-red-500">Failed to load user profile</div>
      </div>
    );
  }

  // Fetch related data in parallel
  const [
    { data: education },
    { data: workExperience },
    { data: schedules },
    { data: jobStatuses },
  ] = await Promise.all([
    supabase
      .from("education")
      .select("*")
      .eq("codev_id", user.id)
      .order("start_date", { ascending: false }),
    supabase
      .from("work_experience")
      .select("*")
      .eq("codev_id", user.id)
      .order("date_from", { ascending: false }),
    supabase.from("work_schedules").select("*").eq("codev_id", user.id),
    supabase.from("job_status").select("*").eq("codev_id", user.id),
  ]);

  // Combine data
  const codevData = {
    ...user,
    education: education || [],
  };

  return (
    <div className="mx-auto max-w-screen-xl mt-8">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex flex-col gap-4 pt-4">
        <H1>Profile Settings</H1>
        <span className="text-sm text-gray-400">
          Complete your profile details to gain more additional points. 
        </span>
        <ProfileCompletionGuide />
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex w-full basis-[70%] flex-col gap-8 2xl:basis-[60%]">
            <PersonalInfo data={codevData} />
            <About data={codevData} />
            <ProfilePointsGate>
              {(points) => (
                <>
                  <ContactInfo
                    earnedCategories={earnedCategories(points)}
                    data={{
                      facebook: user.facebook,
                      linkedin: user.linkedin,
                      github: user.github,
                      discord: user.discord,
                      portfolio_website: user.portfolio_website,
                      phone_number: user.phone_number,
                    }}
                  />
                  <EducationalBackground
                    earnedCategories={earnedCategories(points)}
                    data={education || []}
                    codevId={user.id}
                  />
                  <Experience
                    earnedCategories={earnedCategories(points)}
                    data={workExperience || []}
                    codevId={user.id}
                  />
                </>
              )}
            </ProfilePointsGate>
          </div>
          <div className="flex w-full basis-[30%] flex-col gap-8 2xl:basis-[40%]">
            <ProfilePointsGate>
              {(points) => (
                <>
                  <Photo
                    earnedCategories={earnedCategories(points)}
                    data={{ image_url: user.image_url || null }}
                  />
                  <Skills
                    earnedCategories={earnedCategories(points)}
                    data={{
                      tech_stacks: user.tech_stacks,
                      level: user.level,
                    }}
                  />
                </>
              )}
            </ProfilePointsGate>
            <TimeSchedule data={schedules?.[0] || null} />
            <JobStatuses data={jobStatuses || []} />
            
          </div>
        </div>
      </div>
    </div>
  );
}