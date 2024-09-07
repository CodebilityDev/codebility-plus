import React from "react";
import NewOrder from "@/components/dashboard/orders/NewOrder";
import PreparingOrder from "@/components/dashboard/orders/PreparingOrder";
import ServingOrder from "@/components/dashboard/orders/ServingOrder";
import OrderStatus from "@/components/dashboard/orders/OrderStatus";
import { ordersService, menuService } from "@/modules";
import Error from "@/components/dashboard/orders/Error";
import { OrderStatus as OrderStatusEnum } from "@/modules/orders/orders.type";
import Reloader from "@/components/dashboard/orders/Reloader";

const handleGetOrderData = async () => {
  // const orders = await ordersService.getOrders()
  // const menus = await menuService.getMenus()
  const [orders, menus] = await Promise.all([
    ordersService.getOrders(), 
    menuService.getMenus(),
  ])
  if (!orders || !menus) {
    console.error(
      "failed to get orders or menus", 
      orders === undefined && "orders missing", 
      menus === undefined && "menus missing"
    )
    return
  }
  orders.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return { orders, menus }

}

const OrderPage = async ({searchParams}:{searchParams:{filter?:OrderStatusEnum}}) => {

  const data = await handleGetOrderData()

  if (!data) {
    return (
      <Error path="/dashboard/orders" />
    )
  }

  const {orders, menus} = data

  const pendingOrders = orders.filter(o => o.status === OrderStatusEnum.Pending)
  const ongoingOrders = orders.filter(o => o.status === OrderStatusEnum.Ongoing)
  const completedOrders = orders.filter(o => o.status === OrderStatusEnum.Completed)
  return (
    <>
      <OrderStatus filter={searchParams?.filter} orders={orders} />
      { (searchParams?.filter === undefined || searchParams.filter === OrderStatusEnum.Pending) && <NewOrder orders={pendingOrders} menus={menus} type={OrderStatusEnum.Pending} />}
      { (searchParams?.filter === undefined || searchParams.filter === OrderStatusEnum.Ongoing) && <PreparingOrder orders={ongoingOrders} menus={menus} type={OrderStatusEnum.Ongoing} />}
      { (searchParams?.filter === undefined || searchParams.filter === OrderStatusEnum.Completed) && <ServingOrder orders={completedOrders} menus={menus} type={OrderStatusEnum.Completed} />}
      <Reloader />
    </>
  );
};

export default OrderPage;
