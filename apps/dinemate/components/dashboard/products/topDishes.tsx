

"use client";


import { useState } from "react"

interface IEmptyContainer {
    topDishes: {
        name: string;
        percent: number;
        menuId: string;
        amount: string;
    }[] | undefined
    
}

export default function EmptyContainer({topDishes}:IEmptyContainer){


    const [data, setData] = useState([
        {id: 1, productName: "All Beef Burger" , percentage: "+15.3% from Last week"},
        {id: 2, productName: "Striploin Steak" , percentage: "+12.1% from Last week"},
        {id: 3, productName: "Pork Ribs" , percentage: "+9.5% from Last week"},
        {id: 4, productName: "Roasted Chicken" , percentage: "+7.5% from Last week"},
        {id: 5, productName: "Caramel Cheese Cake" , percentage: "+6.7% from Last week"}

    ])


    const dishes = topDishes ?? []

    return (
    <>

<div className="flex flex-col  bg-white rounded-[0.625em]  mb-[1em] mx-[0.75em] mt-[1em]">

<div className="flex items-center   mx-[1.5em] mt-[2.25em]">
    <p className="font-normal text-[1.5em] whitespace-nowrap">Top Dishes for the week</p>
</div>


<div className="flex flex-wrap bg-white  mt-[1.75em] rounded-[0.625em]   max-w-[22.3125em] gap-[1em] mb-[1em] ">

    
{dishes.map((item,index) => (

    <div className="flex-[1]  xl:min-w-[calc(100%-20px)] px-[1.5em]" key={item.menuId}>

        <div className="flex flex-col ">

            <div className="flex items-center" >
           
            <p className="font-normal text-[1rem]">{index + 1}. {item.name}</p>

            </div>

            <div className="flex items-center">

                <p className="font-normal text-[0.625rem]">{(item.percent * 100).toFixed(1)}%</p>
            </div>

        </div>



    </div>

))}



</div>

</div>


    
    
    </>
    
)
}