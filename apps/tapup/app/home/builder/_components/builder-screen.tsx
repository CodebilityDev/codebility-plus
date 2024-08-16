'use client'

import Image from 'next/image'
import useBuilderFormData from '../_hooks/useBuilderFormData'
import { Button } from '@codevs/ui/button'

function BuilderScreen() {
  const { profileDatas } = useBuilderFormData()
  return (
    <div className="flex flex-1 justify-center">
      <div className="h-[40vw] w-[25vw] overflow-hidden rounded-3xl border border-black bg-white">
        <div className="h-full overflow-y-auto">
          <div className="rounded-b-[2rem] bg-blue-100 pb-5">
            <div className="relative h-52 overflow-hidden rounded-b-3xl">
              <Image
                src={
                  profileDatas.coverPhoto ||
                  '/pikaso_texttoimage_2x2-corporate-headshot-of-a-Filipino-male-and-fema 1.png'
                }
                alt="cover"
                fill
              />
            </div>
            <div className="flex flex-col gap-y-1 px-5 pt-3">
              <div>
                <div>
                  <h4 className="-mb-1">{profileDatas.displayName}</h4>
                  <h5>{profileDatas.industryRole}</h5>
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

export default BuilderScreen
