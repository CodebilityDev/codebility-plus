import { Button } from '@codevs/ui/button'
import { getSupabaseServerComponentClient } from '@codevs/supabase/server-component-client'
import { cookies } from 'next/headers'
import Image from 'next/image'

async function ProfilePage({ params }: { params: { domain: string } }) {
  const supabase = getSupabaseServerComponentClient()

  const { data: card } = await supabase
    .from('cards')
    .select()
    .eq('profile_key', params.domain)
    .single()

  const { data: profileDatas } = await supabase
    .from('builder_profile_data')
    .select()
    .eq('card_id', card.id)
    .single()

  return (
    <div className="flex h-screen flex-1 items-center justify-center">
      <div className="h-[40vw] w-[25vw] overflow-hidden rounded-3xl border border-black bg-white">
        <div className="h-full overflow-y-auto">
          <div className="rounded-b-[2rem] bg-blue-100 pb-5">
            <div className="relative h-52 overflow-hidden rounded-b-3xl">
              <Image
                src={
                  profileDatas.cover_photo ||
                  '/pikaso_texttoimage_2x2-corporate-headshot-of-a-Filipino-male-and-fema 1.png'
                }
                alt="cover"
                fill
              />
            </div>
            <div className="flex flex-col gap-y-1 px-5 pt-3">
              <div>
                <div>
                  <h4 className="-mb-1">{profileDatas.display_name}</h4>
                  <h5>{profileDatas.industry_role}</h5>
                </div>
                <div></div>
              </div>
              <div className="break-words text-xs font-medium text-gray-500">
                {profileDatas.bio}
              </div>
            </div>
            <div className="my-5 flex justify-center">
              <Button className="h-0 py-4">Add Contact</Button>
            </div>
          </div>
          <div className="-mt-7  h-40 px-6">
            <div className="h-full w-full rounded-3xl bg-white"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
