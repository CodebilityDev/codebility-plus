import { OrderStatus } from "@/modules/orders/orders.type";
import { useRouter } from "next/navigation";
import React from "react";

interface OrderStatusProps {
  count: number;
  label: string;
  filter?: OrderStatus
  type: OrderStatus
}

const OrderStatusFunction: React.FC<OrderStatusProps> = ({ count, label, filter, type }) => {
  const router = useRouter()  
  return (
    <div 
    role="button"
    tabIndex={1}
    onClick={() => {
      if (filter !== type) {
        router.replace(`/dashboard/orders?filter=${type}`)
      } else {
        router.replace("/dashboard/orders")
      }
    }}
    className={`${filter === type ? "bg-custom-primary text-white" : "bg-white"} 
    rounded-lg p-4 hover:bg-orange-500 hover:text-white transition duration-300 cursor-pointer`}>
      <h3 className="text-base">
        <span className="px-3 py-2 mr-2 -ml-2 rounded-full bg-black text-white">
          {count < 10 ? `0${count}` : count}
        </span>
        {label}
      </h3>
    </div>
  );
};

export default OrderStatusFunction;
