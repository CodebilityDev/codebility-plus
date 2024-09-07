import React from "react";
import Timer from "../timer/Timer";
import Image from "next/image";
import checkList from "@/public/block.png";
import greenCheck from "@/public/greenCheck.png";
import orangeCheck from "@/public/orangeCheck.png";
import { useOrders } from "@/hooks/useOrders";
import { Orders, OrderStatus } from "@/modules/orders/orders.type";
import { IMenu } from "@/modules/menu/menu.types";
import { useEffect, useState } from "react";
import axios from "axios";
import { CircleCheckBig, Dot } from "lucide-react";
import { ordersService } from "@/modules";
import { useToast } from "@/components/ui/use-toast";
import { revalidate } from "@/lib/revalidate";
import MarkAsPaid from "./MarkAsPaid";

interface OrderCardProps {
  menus: IMenu[];
  type: OrderStatus;
  table: string;
  items: Orders
  total: number;
  // estimatedTime?: string;
  status: string;
  userId: string;
  orderId: string;
  // estimatedTimeInMinutes: number;
  isPaid?: boolean
}


const getStatusImage = (status: string) => {
  switch (status) {
    case "New":
      return checkList;
    case "Preparing":
      return orangeCheck;
    case "Serving":
      return greenCheck;
    default:
      return null;
  }
};

const OrderCard = ({
  menus,
  type,
  table,
  items,
  total,
  // estimatedTime,
  status,
  userId,
  orderId,
  isPaid
  // estimatedTimeInMinutes,
}: OrderCardProps) => {
  const {toast} = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const statusImage = getStatusImage(status);
  // const { orders, setOrders, removeOrder } = useOrders((state) => state);

  // const onStartOrder = () => {
  //   const findOrder = orders.find((order) => order.orderId === orderId);
  //   if (findOrder) {
  //     findOrder.status = "Preparing";
  //     setOrders(orders);
  //   }
  // };

  // const onServeOrder = () => {
  //   console.log("Serve Order");
  //   removeOrder(orderId);
  // };

  const handleUpdateOrderStatus = async (orderId:string, newStatus: OrderStatus) => {
    try {
      setIsLoading(true)
      const updateResult = await ordersService.updateOrderStatus(orderId, newStatus)
      if (!updateResult) {
        toast({
          title: "Updating order status failed",
          variant: "destructive"
        })
      } else {
        toast({
          title: "Updating order status success",
        })        
        revalidate("/dashboard/orders")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const [username, setUsername] = useState("")

  const displayTime = menus.filter(m => items.some(i => i.menuId === m._id)).reduce((acc,curr) => acc=Math.max(acc, curr?.prepareTime ?? 0), 0)

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/username/${userId}`, {
      withCredentials: true
    })
    .then(res => {
      if (res.status === 200) {
        setUsername(res.data.username)
      }
    })
  }, [])


  return (
    <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/4 p-1 flex-shrink-0 sm:text-xs md:text-sm lg:text-base">
      <div className="flex flex-col py-4 px-6 bg-white rounded-lg border border-gray-300 shadow-md h-full w-full">
        <div className="flex flex-row w-full">
          { type === OrderStatus.Pending && 
          <div className="basis-1/3">
            <p className="font-bold">Est. Time</p>
            <p className="text-[12px]">{displayTime} mins.</p>
          </div>}
          { type === OrderStatus.Ongoing && 
          <div className="basis-1/5">            
            <Timer 
              minutes={displayTime}
              size={40}
              status={status}
              orderId={orderId}
              />
          </div>
          }
          { type === OrderStatus.Completed && 
          <div className="basis-1/5">            
            <Timer 
              minutes={displayTime}
              size={40}
              status={status}
              orderId={orderId}              
              />
          </div>
          }
          <div className="basis-1/3">
            <p className="font-bold">Table #{table}</p>
            <p className="text-[12px]">{username}</p>
          </div>
          <div className="flex-grow flex flex-col items-end">
            <p className="font-bold">#{orderId.substring(0,5)}...</p>
            <p className="text-[12px]">Pending</p>
          </div>
        </div>
        <div className="mb-2 flex-grow">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-gray-700 mb-1"
            >
              <span className="flex items-center">
                {
                  type === OrderStatus.Pending ?
                  <Dot size={24} /> :
                  type === OrderStatus.Ongoing ?
                  <CircleCheckBig size={14} className="stroke-custom-primary" /> :
                  <CircleCheckBig size={14} className="stroke-green-600" /> 
                }
                &nbsp;&nbsp;{menus.find(m => m._id === item.menuId)!.name}
              </span>
              <span>{menus.find(m => m._id === item.menuId)!.price.toLocaleString()}</span>
            </div>
          ))}
        </div>
        { !isPaid && <div className="flex flex-row items-center justify-between py-2">
          <p className="font-semibold">Status: Unpaid</p>
          <MarkAsPaid orderId={orderId} />
        </div>}
        <hr className="mb-3" />
        <div className="flex justify-between items-center mb-1 text-gray-800">
          <div>Total: {total.toFixed(2)}</div>
        
            <button
              onClick={() => {
                handleUpdateOrderStatus(
                  orderId,
                  type===OrderStatus.Pending ? OrderStatus.Ongoing :
                  type === OrderStatus.Ongoing ? OrderStatus.Completed :
                  OrderStatus.Served
                )
              }}
              className="bg-green-500 text-white px-4 py-2.5 rounded-2xl sm:px-2.5 sm:py-1.2 sm:text-xs md:text-sm lg:text-base"
            >
              {
                type === OrderStatus.Pending ?
                "Start Order" :
                type === OrderStatus.Ongoing ?
                "Complete Order" :
                "Serve Order"
              }              
            </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
