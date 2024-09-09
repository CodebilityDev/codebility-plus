import Image from "next/image"

export default function UploadFile(){

    return (
    
    <>

    <div className="flex flex-col  ">


        <div className="flex items-center justify-center   mx-[0.75em] mt-[-1.8em]  relative ">


<div className="flex items-center  ">

<Image 
src={`/dashboardcarousel-icon.svg`}
width={100}
height={0}
className="aspect-[1] object-contain min-w-[22.3125em]   "
alt="dashboard courosel"

>

</Image>

</div>



<div className="flex flex-col   top-16 right-0 absolute">

    <div className="flex items-center mx-[0.75em] my-[0.75em] px-[0.75em] py-[0.25em]  bg-white rounded-[0.625em] ">

        <button className=" whitespace-nowrap text-[0.8rem] font-normal mr-[0.25em]">Upload File</button>
        <Image 
        src={`/DashboardUpload-icon.svg`}
        width={15}
        height={0}
        alt="Dashboard Upload"
        className="aspect-[1] object-contain min-w-[0.9375em] "
        
        ></Image>
        
    </div>
</div>



        </div>





    </div>
    
    
    </>
    
)
}