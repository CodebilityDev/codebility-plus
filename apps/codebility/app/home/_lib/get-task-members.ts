import { CodevTask } from "@/types/home/task";
import { Profile } from "@/types/home/user";

import { Member } from "../_types/member";

export function getTaskMembers(codevTask: CodevTask[]): Member[] {
  return codevTask.map(({ codev }) => {
    const { email, id } = codev.user as { email: string; id: string };
    const { first_name, last_name, image_url } = codev.user?.profile as Profile;

    return {
      id: codev.id,
      email,
      first_name,
      last_name,
      image_url,
      user_id: id,
    };
  });
}
