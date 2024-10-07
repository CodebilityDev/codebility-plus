import BackLink from "@/components/products/BackLink"
import Image from "next/image"
import MenuDrawer from "@/components/products/MenuDrawer"
import { menuService } from "@/modules"
import Link from "next/link"

const ProductPage = async ({params}:{params: {id: string}}) => {
  const id = params.id;

  const menuItem = await menuService.getMenuItem(id)  

  if (!menuItem) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen z-50 bg-white">
        <p>Something went wrong</p>  
        <Link href={"/"}>Back to Home</Link>
      </div>
    )
  }


  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-50 bg-white">
      <div className="absolute top-5 left-0 px-5">
      <BackLink />
      </div>
      <Image 
      src={menuItem?.imageUrl || ''} 
      width={375}
      height={429}
      alt="burger"
      className="w-screen h-auto pt-4"
      />
      <MenuDrawer {...menuItem} />
    </div>
  )
}

export default ProductPage