import { Dialog, DialogContent } from "@codevs/ui/dialog"
import { useModal } from "@/hooks/use-modal-users"
import Image from "next/image"
import Link from "next/link"
import Box from "@/Components/shared/dashboard/Box"
import Badges from "@/Components/shared/Badges"
import { defaultAvatar } from "@/public/assets/images"
import { skills, socials, tokenPoints } from "@/app/(protectedroutes)/interns/data"

const ProfileModal = () => {
  const { isOpen, type, onClose, data } = useModal()
  const { first_name, last_name, image_url, address, about_me, main_position, jobStatusType, projects } = data || {}

  const isModalOpen = isOpen && type === "profileModal"

  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent
        hasButton
        className="mx-auto flex h-[90%] w-96 max-w-3xl flex-col overflow-y-scroll md:h-auto md:w-[95%] md:flex-row"
      >
        <Box className="mx-auto flex w-full flex-col items-center justify-center gap-6 rounded-lg border-none bg-light-700 text-center md:w-1/3">
          <div className="relative size-24 self-center rounded-full bg-gradient-to-b from-violet to-blue-500 bg-cover object-cover">
            <Image
              alt={`${first_name} Avatar`}
              src={image_url || defaultAvatar}
              fill
              className="h-[70px] w-[70px] rounded-full bg-cover object-cover p-0.5"
              loading="eager"
            />
          </div>
          <div className="flex w-full flex-col items-center bg-light-800 p-4 py-3 dark:bg-dark-400">
            <p className="text-2xl font-semibold capitalize">
              {first_name} {last_name}
            </p>
            {main_position ? null : <p className="font-extralight capitalize dark:text-lightgray">{main_position}</p>}
            <p className="font-normal capitalize">{address}</p>
          </div>
          <div className="flex w-full flex-col items-center gap-2 py-1">
            <p className="dark:text-gray">Status</p>
            <p
              className={`w-min rounded-md px-3 py-1 ${
                jobStatusType === "AVAILABLE"
                  ? "bg-green-400"
                  : jobStatusType === "DEPLOYED"
                  ? "bg-orange-400"
                  : "bg-gray"
              }`}
            >
              {jobStatusType === "AVAILABLE" ? "Available" : jobStatusType === "DEPLOYED" ? "Deployed" : "Inactive"}
            </p>
          </div>
          <div className="flex w-full flex-col items-center gap-2 py-6">
            <p className="dark:text-gray">Current Project</p>
            {projects?.map((projects) => (
              <p key={projects?.id} className="text-2xl font-semibold capitalize">
                {projects?.project?.project_name}
              </p>
            ))}
          </div>
          <div className="pb-6">
            <p className="dark:text-gray">Badges</p>
            <Badges />
          </div>
        </Box>
        <Box className="mx-auto flex w-full flex-col gap-6 rounded-lg border-none bg-light-700 pt-6 md:w-2/3">
          <div>
            <p className="pb-2.5 dark:text-gray">Socials</p>
            <div className="flex gap-2">
              {socials.map(({ Icon }) => (
                <Link key={Icon} href="#" target="_blank">
                  <Icon className="h-5 w-5 duration-300 hover:-translate-y-1" />
                </Link>
              ))}
            </div>
          </div>
          <div className="py-4">
            <p className="pb-2.5 dark:text-gray">About Me</p>
            {about_me ? <p className="h-40 overflow-y-auto">{about_me}</p> : <p></p>}
          </div>
          <div className="pb-4">
            <p className="pb-2.5 dark:text-gray">Token Points</p>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {tokenPoints.map((token) => (
                <div
                  key={token.points}
                  className="flex w-full flex-col items-center rounded-lg border p-4 dark:border-gray"
                >
                  <p className="text-3xl">{token.points}</p>
                  <p className=" dark:text-gray">{token.position}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="pb-4">
            <p className="pb-2.5 dark:text-gray">Skills</p>
            <div className="flex gap-2">
              {skills.map(({ Icon }, index) => (
                <Link key={index} href="#" target="_blank">
                  <Icon className="h-5 w-5 duration-300 hover:-translate-y-1" />
                </Link>
              ))}
            </div>
          </div>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileModal