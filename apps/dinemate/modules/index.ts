import MenuService from "./menu/menu.service";
import AssistService from "./assist/assist.service";
import CartService from "./cart/cart.service";
import OrdersService from "./orders/orders.service";
import AdminService from "./admin/admin.service";

const menuService = new MenuService()
const assistService = new AssistService()
const cartService = new CartService()
const ordersService = new OrdersService()
const adminService = new AdminService()

export {
  menuService,
  assistService,
  cartService,
  ordersService,
  adminService
}