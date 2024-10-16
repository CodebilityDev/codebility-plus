import { Dispatch, SetStateAction } from "react";


export default function AssistancePage({
  text,
  setText
}: {
  text: string;
  setText: Dispatch<SetStateAction<string>>
}) {



  return (

    <>




<div className="flex flex-col px-[1.3125em]  rounded-[1.25em] bg-white ">

  <div className="flex items-center  mt-[0.75em]">

    <p className="text-[1.125rem] font-semibold">Ask for assistance</p>

  </div>

  <div className="flex items-center mt-[0.5em]">

    <p className="text-left text-[#979797] font-normal">Write your detailed instruction and wait for the service crew to help you.</p>

  </div>


  <div className="flex items-center justify-center   mb-[2em] mt-[1em]">

    <textarea className="w-full min-h-[11.875em] rounded-[1.125em]  focus:outline-none focus:ring-none focus:ring-[#C2C7D0] border border-[#C2C7D0] resize-none pl-[1em] pt-[1.3125em] font-normal"
    placeholder="E.g. We want to ask for extra plate and utensils..."
    value={text}
    onChange={(e) => setText(e.currentTarget.value)}
    >

  </textarea>

  </div>


</div>

    
    </>

   
  );
}
