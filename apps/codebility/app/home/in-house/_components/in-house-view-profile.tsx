import Image from "next/image"
import { useModal } from "@/hooks/use-modal-users"
import { Codev } from '@/types'

export default function ViewProfile({ user }: { user: Codev }) {
  const { onOpen } = useModal()

  return (
    <button onClick={() => onOpen("profileModal", user)}>
      <Image
        src={"https://codebility-cdn.pages.dev/assets/svgs/icon-eye.svg"}
        alt="See Profile"
        width={0}
        height={0}
        style={{ width: '1rem', height: "auto" }}
      />
    </button>
  )
}
