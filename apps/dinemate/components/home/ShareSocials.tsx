'use client'

import { useStore } from '~/hooks/useStore'
import { FacebookMessengerIcon, FacebookMessengerShareButton, InstagramIcon, InstapaperIcon, InstapaperShareButton, ViberIcon, ViberShareButton, WhatsappIcon, WhatsappShareButton} from 'next-share'


const ShareSocials = ({link}: {link: string}) => {
  const session = useStore(s => s.session)

  const shareLink = `${link}${session ? `?tableSessionId=${session._id}` : ""}`


  return (
    <section className='mt-8'>
      <h4 className='text-center font-normal text-sm'>Or Share via Socials</h4>
      <div className="flex justify-center gap-8 mt-5">
        <FacebookMessengerShareButton 
          url={shareLink} 
          appId={process.env.NEXT_PUBLIC_FB_APP_ID!}
        >
          <div className="flex flex-col items-center gap-3">
            <FacebookMessengerIcon size={32} round />
            <span className='text-[8px]'>Messenger</span>
          </div>
        </FacebookMessengerShareButton>
        <ViberShareButton url={shareLink} >
          <div className="flex flex-col items-center gap-3">
            <ViberIcon size={32} round />
            <span className='text-[8px]'>Viber</span>
          </div>
        </ViberShareButton>
        <WhatsappShareButton url={shareLink} >
          <div className="flex flex-col items-center gap-3">
            <WhatsappIcon size={32} round />
            <span className='text-[8px]'>Whatsapp</span>
          </div>
        </WhatsappShareButton>
      </div>
    </section>
  )
}

export default ShareSocials