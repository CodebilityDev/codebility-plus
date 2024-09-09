

import Image from "next/image";
import type { IMenu } from "~/modules/menu/menu.types";
import EditMenuButton from "./EditMenuButton";

interface IProductItems {
  menus?: IMenu[];
}

export default function ProductItems({menus=[]}:IProductItems){

    const data = [
        { id: 1, title: 'Steak', image: '/roasted-chicken.png', description: 'Description for Item 1', stock: '12' , price: '170.00'},
        { id: 2, title: 'Steak', image: '/roasted-chicken.png', description: 'Description for Item 1', stock: '12' , price: '170.00'},
        { id: 3, title: 'Steak', image: '/roasted-chicken.png', description: 'Description for Item 1', stock: '12' , price: '170.00'},
        { id: 4, title: 'Steak', image: '/roasted-chicken.png', description: 'Description for Item 1', stock: '12' , price: '170.00'},
        { id: 5, title: 'Steak', image: '/roasted-chicken.png', description: 'Description for Item 1', stock: '12' , price: '170.00'},
        { id: 6, title: 'Steak', image: '/roasted-chicken.png', description: 'Description for Item 1', stock: '12' , price: '170.00'},
        { id: 7, title: 'Steak', image: '/roasted-chicken.png', description: 'Description for Item 1', stock: '12' , price: '170.00'},
        
        { id: 8, title: 'Steak', image: '/roasted-chicken.png', description: 'Description for Item 1', stock: '12' , price: '170.00'},
        { id: 9, title: 'Steak', image: '/roasted-chicken.png', description: 'Description for Item 1', stock: '12' , price: '170.00'},
        { id: 10, title: 'Steak', image: '/roasted-chicken.png', description: 'Description for Item 1', stock: '12' , price: '170.00'},
        { id: 11, title: 'Steak', image: '/roasted-chicken.png', description: 'Description for Item 1', stock: '12' , price: '170.00'},
        { id: 12, title: 'Steak', image: '/roasted-chicken.png', description: 'Description for Item 1', stock: '12' , price: '170.00'},
        { id: 13, title: 'Steak', image: '/roasted-chicken.png', description: 'Description for Item 1', stock: '12' , price: '170.00'},
        { id: 14, title: 'Steak', image: '/roasted-chicken.png', description: 'Description for Item 1', stock: '12' , price: '170.00'},
        { id: 15, title: 'Steak', image: '/roasted-chicken.png', description: 'Description for Item 1', stock: '12' , price: '170.00'},
        { id: 16, title: 'Steak', image: '/roasted-chicken.png', description: 'Description for Item 1', stock: '12' , price: '170.00'},
        { id: 17, title: 'Steak', image: '/roasted-chicken.png', description: 'Description for Item 1', stock: '12' , price: '170.00'},
        
        
        // Add more items as needed
      ];


    return (
    
    <>

    <div className="flex flex-wrap  mt-[2em] gap-[0.75em]">
      {menus.map(item => (
        <div key={item._id} className="flex-1 min-w-[11.0625em]   bg-white rounded-[0.625em] xl:min-w-[calc(25%-20px)]">

            <div className="flex flex-col ">

            <div className="flex items-center justify-center  bg-[#F4DECF] rounded-[0.625em] m-[0.5em]">

<Image 
src={item.imageUrl}
width={100}
height={0}
alt={item.name}
className="aspect-[1] object-contain  "
>


</Image>


</div>

<div className="flex items-center mt-[0.75em] m-[0.5em]">
    <p className="font-normal text-[0.9rem] whitespace-nowrap" >{item.name}</p>


</div>

<div className="flex items-center  mx-[0.5em]">

    <p className="font-normal text-[0.8rem] font-inter truncate">{item.description}</p>
</div>


<div className="flex flex-col mt-[0.7em] mx-[0.5em] mb-[0.8125em]">

    <div className="flex items-center justify-between">



        <div className="flex flex-col">

        <div className="flex items-center ">

        <p className="whitespace-nowrap text-[0.8rem] font-normal">₱ {item.price}</p>

          <Image

          src={`/dashboardChecklist-icon.svg`}
          width={12}
          height={0}
          alt="dashboard checklist"
          className="aspect-[1] object-contain min-w-[0.75em] ml-[0.25em]"
          
          ></Image>

            {/* TODO: resolve this */}
            { item.quantity && <p className="whitespace-nowrap ml-[0.075em] text-[0.5rem] underline">{item.quantity} in stock</p>}

            </div>

        </div>





        <div className="flex flex-col ">

           <div className="flex items-center">
              <EditMenuButton menuId={item._id} />        
          </div>

           </div>




        

    </div>



</div>

            </div>

           

         

        </div>
      ))}
    </div>


     
    
    </>
    
)
}