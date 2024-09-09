"use client";
import React, { useEffect, useRef, useState } from "react";
import { useDraggable } from "react-use-draggable-scroll";
import { ordersData } from "~/lib/dummyOrders";
import NoOrder from "./NoOrder";
import { useOrders } from "~/hooks/useOrders";
import OrderCard from "~/components/dashboard/orders/OrderCard";
import { IOrders } from "~/modules/orders/orders.type";
import { IMenu } from "~/modules/menu/menu.types";
import { OrderStatus } from "~/modules/orders/orders.type";

const NewOrder = ({orders, menus, type}:{orders:IOrders[]; menus: IMenu[]; type: OrderStatus}) => {
  // const { orders, setOrders } = useOrders((state) => state);
  // const newOrders = orders.filter((order) => order.status === "New");  
  const ref =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const { events } = useDraggable(ref);  
  // useEffect(() => {
  //   setOrders(ordersData);
  // }, [setOrders]);

  return (
    <div className="m-1 p-3 overflow-x-hidden">
      <h2 className="text-2xl font-bold mb-2 underline">New</h2>
      <div
        className="flex flex-row flex-nowrap overflow-x-auto space-x-4 no-scrollbar"
        ref={ref}
        {...events}
      >
        {orders.length === 0 ? (
          <NoOrder status="new" />
        ) : (
          orders.map((order) => (
            <OrderCard
              type={type}
              menus={menus}           
              key={order._id}
              table={order.tableNumber}
              items={order.orders}
              total={order.totalBill}
              // estimatedTime={order.estimatedTime}
              status={order.status}
              userId={order.userId}
              orderId={order._id}
              isPaid={order.isPaid}
              // estimatedTimeInMinutes={order.estimatedTimeInMinutes}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NewOrder;
