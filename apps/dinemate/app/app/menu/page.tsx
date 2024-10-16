import Menu from "@/components/menu/menu"
import Greetings from '@/components/home/Greetings'
import NotificationButton from '@/components/NotificationButton'
import SearchBar from "@/components/home/SearchBar"
import { menuService } from "@/modules"
import ProductTiles from "@/components/home/ProductTiles"
import Categories from "@/components/home/Categories"

const MenuPage = async ({searchParams}:{searchParams:{search?:string;category?:string}}) => {
  const search = searchParams?.search
  const category = searchParams?.category

  const menus = await menuService.getMenus(category, search)
  return (
    <>
      <div className='flex justify-between mt-3 text-white'>
      <Greetings/>
      <NotificationButton/>
     </div>

     <main className='flex-1 h-full overflow-y-scroll '>
        <SearchBar />
        <Categories />
        <ProductTiles menus={menus} />
      </main>
    
    </>


  

  )
}

export default MenuPage