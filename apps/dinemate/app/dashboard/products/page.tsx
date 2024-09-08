






import SearchBar from "~/components/dashboard/products/searchBar";
import AllProducts from "~/components/dashboard/products/allProducts";
import AddNew from "~/components/dashboard/products/addNew";

import Activity from "~/components/dashboard/products/activity";

import ProductItems from "~/components/dashboard/products/productItems";
import UploadFile from "~/components/dashboard/products/uploadFile";
import WeeklyAwards from "~/components/dashboard/products/weeklyAwards";
import EmptyContainer from "~/components/dashboard/products/topDishes";
import { menuService, ordersService } from "~/modules";



const ProductsPage = async ({searchParams}:{searchParams: {category:string; search:string}}) => {
  const category = searchParams?.category
  const search = searchParams?.search
  // const menus = await menuService.getMenus(category, search)
  const [menus, topDishes] = await Promise.all([
    menuService.getMenus(category, search),
    ordersService.getTopDishesOfTheWeek()
  ])
  return (

    <>


    <div className="flex flex-col">


      <div className="flex justify-between">

  <div className="flex flex-col ">

<div className="flex flex-col mr-[0.75em]">

  <div className="flex items-center  ">

  <SearchBar initialSearch={search} />
  <AllProducts  />
  <AddNew/>

  </div>
 
</div>



<div className="flex flex-col mr-[0.75em]">

  <div className="flex items-center">

 
<ProductItems menus={menus} />

  </div>

</div>

</div>



<div className="flex flex-col rounded-[0.625em] bg-[#F4DECF]">

<div className="flex items-center justify-center">

<Activity/>

</div>

<div className="flex items-center">

<UploadFile/>

</div>

<div className="flex items-center">

  <WeeklyAwards/>

</div>


<div className="flex items-center">

 <EmptyContainer topDishes={topDishes} />

</div>



</div>



      </div>
    </div>
    

    



    


    
    </>
   

    
  )
}

export default ProductsPage