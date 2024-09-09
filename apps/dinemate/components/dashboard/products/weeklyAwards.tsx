
import Image from "next/image"
import { ordersService } from "~/modules"

export default async function WeeklyAwards(){
    const mostOrdered = await ordersService.getMostOrdered()

    if (!mostOrdered || mostOrdered.mostOrdered === null) {
        return <></>
    }

    const percent = (mostOrdered.percent * 100).toFixed(2)
    const sign = mostOrdered.percent >= 1 ? "+" : "-"
    return (
    
    <>

    <div className="flex flex-col  bg-white rounded-[0.625em] mx-[0.75em] mt-[-3em] w-full">

        <div className="flex items-center mx-[1.25em] mt-[2.875em]">

            <p className="text-[1rem] font-normal text-[#666666]">Most Ordered Dish of the week Winner</p>


        </div>

        <div className="flex flex-col mx-[1.25em]">

            <div className="flex items-center justify-between">

                <p className="text-[#030101] text-[1.5rem] font-bold whitespace-nowrap">{mostOrdered.mostOrdered}</p>

                <Image
                src={`/trophy-icon.svg`}
                width={67}
                height={0}
                alt="trophy logo"
                className="aspect-[1] object-contain min-w-[4.1875em]"
                
                ></Image>


            </div>
        </div>


        <div className="flex items-center mx-[1.25em] mb-[2.875em]">

            <p className="text-[#666666] text-[1rem] font-normal">{sign}{percent}% as of this week</p>

        </div>


    </div>
    
    </>
    
)
}