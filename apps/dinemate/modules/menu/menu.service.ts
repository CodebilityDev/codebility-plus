import axios, { AxiosError } from "axios"
import { IMenu, AddMenuDto, UpdateMenuDto } from "./menu.types"

export default class MenuService {
  private readonly url = `${process.env.NEXT_PUBLIC_API_URL}/api/menu`

  getMenus = async (category?: string, search?: string) => {
    const cat = !category || category === "all" ? "" : `?category=${category}`
    const sea = (cat && search) ? `&search=${search}` : search ? `?search=${search}` : ""
    const searchParams = `${cat}${sea}`
    try {
      const response = await axios.get<IMenu[]>(`${this.url}/${searchParams}`)
    return response.data
    } catch (error) {
      console.error(error)
    }
    
  }

  getMenuItem = async (id:string) => {
    try {
      const response = await axios.get<IMenu>(`${this.url}/${id}`)
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response)
        return
      }
      console.error(error)
    }
    
  }

  addMenu = async (newMenu:AddMenuDto) => {
    try {
      const response = await axios.post<IMenu>(`${this.url}`, newMenu)
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response)
        return
      }
      console.error(error)
    }
    
  }

  removeMenu = async (menuId:string) => {
    const response = await axios.post(`${this.url}/${menuId}`)
    return response.data
  }

  updateMenu = async (menuId: string, update:UpdateMenuDto) => {
    try {
      const response = await axios.patch<IMenu>(`${this.url}/${menuId}`, update)
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response)
        return
      }
      console.error(error)
    }
    
  }  

  getSpecificMenus = async (menuIds: string[]) => {
    try {
      const response = await axios.post<IMenu[]>(`${this.url}/in`,{
        menuIds
      })
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response)
        return
      }
      console.error(error)
    }
    
  }
}

