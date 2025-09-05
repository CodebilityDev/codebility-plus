'use client'
import { useStore } from '~/hooks/useStore';
import { useQRCode } from 'next-qrcode';

const QrGenerator = ({link}: {link: string}) => {
  const {SVG}: any = useQRCode();
  const session = useStore(s => s.session)
 
  const shareLink = `${link}${session ? `?tableSessionId=${session._id}` : ""}`

  return (
    <div className="flex flex-col items-center pt-9">
      <h2 className='text-center mb-8 text-[20px] font-normal'>Let your companion order by scanning your QR code.</h2>
      <div className="border border-[#091E42] shadow-lg">
        <SVG
          text={shareLink}
          options={{
            margin: 5,
            width: 300,
            color: {
              dark: '#000000',
              light: '#FFFFFF',
            },
          }}
        />  
      </div>
    </div>
  )
}

export default QrGenerator