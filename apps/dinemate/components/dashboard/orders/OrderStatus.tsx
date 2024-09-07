"use client";
import React from "react";
import OrderStatusFunction from "./OrderStatusFunction";
import { useOrders } from "~/hooks/useOrders";
import { IOrders, OrderStatus as OrderStatusEnum } from "~/modules/orders/orders.type";

const OrderStatus = ({
  filter,
  orders
}:{
  filter?:OrderStatusEnum,
  orders: IOrders[]
}) => {
  // const { orders } = useOrders((state) => state);
  const newOrdersCount = orders.filter(
    (order) => order.status === OrderStatusEnum.Pending
  ).length;
  const preparingOrdersCount = orders.filter(
    (order) => order.status === OrderStatusEnum.Ongoing
  ).length;
  const servingOrdersCount = orders.filter(
    (order) => order.status === OrderStatusEnum.Completed
  ).length;

  return (
    <>
      <div className="p-2 rounded-lg mb-2 ">
        <div className="flex space-x-4">
          <OrderStatusFunction filter={filter} type={OrderStatusEnum.Pending} count={newOrdersCount} label="Pending" />
          <OrderStatusFunction filter={filter} type={OrderStatusEnum.Ongoing} count={preparingOrdersCount} label="Preparing" />
          <OrderStatusFunction filter={filter} type={OrderStatusEnum.Completed} count={servingOrdersCount} label="Serving" />
        </div>
      </div>
    </>
  );
};

export default OrderStatus;
