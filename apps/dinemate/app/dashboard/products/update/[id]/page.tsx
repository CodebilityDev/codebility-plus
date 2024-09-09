import { menuService } from "~/modules"
import MenuForm from "~/components/dashboard/products/MenuForm"
import { IMenu } from "~/modules/menu/menu.types"

export default async function UpdateMenuPage({params}:{params:{id:string}}) {
  
  const menuData = await menuService.getMenuItem(params.id) as IMenu

  return (
    <div className="w-full flex flex-col items-center"> 
      <MenuForm menuForm={{...menuData, imageUri: menuData.imageUrl}} type="update" menuId={params.id} />
    </div>
  )
}