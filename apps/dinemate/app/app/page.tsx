import Greetings from '~/components/home/Greetings'
import NotificationButton from '~/components/NotificationButton'
import SearchBar from '~/components/home/SearchBar'
import Categories from '~/components/home/Categories'
import CarouselComponent from '~/components/home/Carousel'
import ProductTiles from '~/components/home/ProductTiles';
import OrdersNav from '~/components/home/OrdersNav'
import { menuService } from '~/modules'

const HomePage = async ({searchParams}: {searchParams: {search?: string}}) => {
  const search = searchParams.search

  const menus = await menuService.getMenus(undefined, search)  

  return (
    <>
      <div className='flex justify-between mt-3 text-white'>
        <Greetings/>
        <NotificationButton/>
      </div>

      <main className='flex-1 h-full overflow-y-scroll '>
        <SearchBar initialSearch={search} />
        <Categories />
        <CarouselComponent />
        <ProductTiles menus={menus} />       
      </main>
      <OrdersNav />      
    </>
  )
}

export default HomePage
