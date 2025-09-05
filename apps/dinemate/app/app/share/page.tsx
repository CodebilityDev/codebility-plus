import QrGenerator from "~/components/home/QrGenerator"
import ShareSocials from "~/components/home/ShareSocials"


const ShareQrPage = () => {


  const shareLink =  process.env.NODE_ENV === "production" 
  ? `https://dinemate-fe.vercel.app/auth/login`  
  : "http://localhost:3000/auth/login"
  return (
    <div className="mt-12 bg-white absolute left-0 top-8 px-5">
        <QrGenerator link={shareLink}/>
        <ShareSocials link={shareLink}/>
    </div>
  )
}

export default ShareQrPage