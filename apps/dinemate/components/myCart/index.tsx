
"use client";

import Image from "next/image";
import { useState , useEffect } from 'react';
import { cartService } from "~/modules";
import { menuService } from "~/modules";
import { IMenu } from "~/modules/menu/menu.types";
import { Button } from "@codevs/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "~/hooks/use-toast";
import { useStore } from "~/hooks/useStore";
import { Cart, OrderType } from "~/modules/cart/cart.types";
import Link from "next/link";
import axios from "axios";
import { ArrowRight } from "lucide-react";


export default function MyCart() {

    interface GroupCart {
        cartContents: {
            menu: IMenu;
            menuId: string;
            amount: number;
            updatedAt: string;
        }[];
        username: string;
        _id: string;
        tableId: string;
        userId: string;
        orderType: OrderType;
        createdAt: string;
        updatedAt: string;
    }

    const [myCartContent, setMyCartContent] = useState<{
        menu: IMenu;
        menuId: string;
        amount: number;
        updatedAt: string;
    }[]>([])
    const [groupCart, setGroupCart] = useState<GroupCart[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const session = useStore(s => s.session)
    const {toast} = useToast()
    const [showPaymentOptions, setShowPaymentOptions] = useState(true);
    const [showGroupsCard, setShowGroupsCard] = useState(false);


    const handleGetGroupCartData = async () => {  
        if (!session || session?.orderType !== OrderType.Group) {
            console.log("session not found")
            return;
        }
        const carts = await cartService.getGroupCart(session._id)
        if (!carts) {
            console.error("error encountered when fetching group cart")
            return
        }
        const userIds = carts.map(c => c.userId)
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/usernames`, {
            userIds
        })
        if (!res.data) {
            console.error("error encountered when fetching usernames")
            return
        }
        const usernames = res.data as {userId:string;username:string}[]
        const cartsWithUsername = carts.map(c => ({...c, username: usernames.find(u => u.userId === c.userId)!.username}))
        const menusIds = carts.flatMap(c => c.cartContents.map(m => m.menuId))
        const menus = await menuService.getSpecificMenus(menusIds)
        if (!menus) {
            console.error("failed to get menu infos")
            return
        }
        const cartsWithMenu = cartsWithUsername.map(c => ({
            ...c, 
            cartContents: c.cartContents.map(m => ({...m, menu: menus.find(me => me._id === m.menuId)!}))
        }))
        // remove self from group
        const filteredCarts = cartsWithMenu.filter(c => c._id !== session?.cartId)

        setGroupCart(filteredCarts)
    }
    

    const handleGetCartData = async () => {        
        if (!session) {
            console.error("session not found")
            return
        }
        const cartData = await cartService.getCart(session.cartId)
        console.log({
            cartData
        })
        if (cartData) {

            const menuIds = cartData.cartContents.map(c => c.menuId)
            console.log({
                menuIds
            })
            const menus = await menuService.getSpecificMenus(menuIds)
            if (!menus) {
                console.error("failed to get menu infos")
                return
            }
            const cartWithMenuData = cartData.cartContents.map((c,i) => ({...c, menu:menus.find(m => m._id === c.menuId)})) as typeof myCartContent
            setMyCartContent(cartWithMenuData)
        }

    }

    const handleAddToCart = async ({
        menuId,
        amount,
        name
    }: {
        menuId: string;
        amount: number;
        name: string;
    }) => {
        if (!session) {
            console.error("session not found")
            return
        }
        if (session.orderId) {
            toast({
                title: "Order is already on the way.",
                description: "Cannot add to cart while order is on the way",
                variant: "destructive"
            })
            return
        }
        try {
            setIsLoading(true)
            const res = await cartService.addToCart(session.cartId, {
                menuId,
                amount
            })
            if (res) {
                handleGetCartData()
            }
            if (res && amount > 1) {
                toast({
                    title: "Success",
                    description: `${name} has been added to your cart.`
                })
            }
            else if (res && amount < 1) {
                toast({
                    title: "Success",
                    description: `${name} has been deducted to your cart.`
                })
            }
            else if (!res) {
                toast({
                    title: "Something went wrong",
                    description: `Failed to update cart.`,
                    variant: "destructive"
                })
            }
        } catch (error) {
            console.error(error)
            toast({
                title: "Something went wrong",
                description: `Failed to update  cart.`,
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
        
    }
    

        

    const myCartTotal = myCartContent.reduce((total, item) => total + (item.menu.price * item.amount), 0);

    const groupsCartTotal = groupCart.reduce((total, group) => {
        return total + group.cartContents.reduce((groupTotal, item) => groupTotal + (item.menu.price * item.amount), 0);
    }, 0);

    const combinedTotal = myCartTotal + groupsCartTotal;

    const togglePaymentOptions = () => {
        setShowPaymentOptions(!showPaymentOptions);
    };

    const toggleGroupsCard = () => {
        setShowGroupsCard(!showGroupsCard);
    };


    const myCartItemCount = myCartContent.reduce((acc,curr) => acc + curr.amount, 0)
    const totalGroups = groupCart.length;

   useEffect(() => {
    console.log("get solo cart effect")
    handleGetCartData()
   }, [session?.cartId])

   useEffect(() => {
    console.log("get group cart effect")
    const interval = setInterval(() => {
        // refresh every 5 seconds
        handleGetGroupCartData()    
    }, 5_000)

    return () => {
        clearInterval(interval)
    }
   }, [session?._id, session?.orderType])

   useEffect(() => {
    // Change the body background color when the component mounts
    document.body.style.backgroundColor = '#DFE2E6';

    // Cleanup function to reset the background color when the component unmounts
    return () => {
      document.body.style.backgroundColor = 'white';
    };
    
  }, []); // Empty dependency array to run only once when the component mounts

    if (session?.orderId) {
        return (
            <div className="bg-white h-screen mt-[118px] p-4 flex flex-col gap-y-4">
                <p className="font-bold text-xl">
                Your order is on the way!
                </p>

                <Link href={"/timer"} className="border-b border-custom-primary w-fit text-custom-primary font-semibold flex flex-row items-center gap-x-1">
                    <p>Go to Order Status Page</p>
                    <ArrowRight size={16} />
                </Link>
            </div>
        )
    }

    return (
        <div className="flex flex-col  mb-36 ">
            
            <div className="flex flex-col  bg-white  rounded-[1.25em] p-[1em] ">
                <div className="flex items-center">
                    <div className="flex items-center justify-center mr-[0.62375em]">
                        <Image
                            src={showPaymentOptions ? "/grayDown-icon.svg" : "/backicon-icon.svg"}
                            alt={`Picture of back icon`}
                            width={23}
                            height={0}
                            className="aspect-[1] object-contain cursor-pointer"
                            onClick={togglePaymentOptions}
                        />
                    </div>
                    <div className="flex items-center justify-center ml-[0.3125em]">
                        <p className="font-semibold text-[1.375rem]">My Cart</p>
                    </div>
                    <div className="flex items-center justify-center mt-[0.7em]">
                        <div className="relative">
                            <div className="absolute top-0 right-0 transform translate-x-[120%] translate-y-[-75%] bg-[#B34909] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                                {myCartItemCount}
                            </div>
                        </div>
                    </div>
                </div>
                



       {/* Conditional rendering of payment options with transition */}
    <div
        className={`${
          showPaymentOptions ? 'max-h-screen' : 'max-h-0 opacity-0'
        } overflow-hidden transition-all duration-1000 ease-in-out `}
      >

        <div className={`flex flex-col`}>
            <div className="flex items-center justify-center">
                <div className={`flex flex-wrap gap-[0.625em] mt-[1.5em]`}>
                    {myCartContent.map(item => (
                        <div key={item.menuId} className="flex-1 min-w-[18em] sm:min-w-[calc(100%-20px)] border border-[#C2C7D0] rounded-[1.125em] bg-[#F3F5F7]">
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col  ml-[0.625em]">
                                        <div className="flex items-center justify-center">
                                            <Image
                                                src={item.menu.imageUrl}
                                                alt={`Picture of ${item.menu.name}`}
                                                width={100}
                                                height={0}
                                                className="aspect-[1] object-contain "
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col  mb-[0.816875em] mt-[0.816875em] mr-[0.625em]">
                                        <div className="flex items-center">
                                            <p className=" text-[0.875rem] font-medium">{item.menu.name}</p>
                                        </div>
                                        <div className="flex items-center gap-[0.5em]">
                                            <div className="flex items-center justify-center">
                                                <Image
                                                    src={`/clock-icon.svg`}
                                                    alt={`Picture of clock icon`}
                                                    width={13}
                                                    height={0}
                                                    className="aspect-[1] object-contain"
                                                />
                                            </div>
                                            <div className="flex items-center justify-center">
                                                <p className="whitespace-nowrap text-[#A6AEBB] text-[0.75rem]">10 min</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-[1em] gap-[2.678125em]">
                                            <div className="flex items-center justify-center">
                                                <p className="font-semibold whitespace-nowrap">₱ {item.menu.price.toFixed(2)}</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center justify-center mr-[0.09125em]">
                                                    <button 
                                                    type="button"
                                                    onClick={() => handleAddToCart({
                                                        menuId: item.menuId,
                                                        amount: -1,
                                                        name: item.menu.name,
                                                    })}
                                                    className="w-fit h-fit disabled:opacity-50"
                                                    disabled={isLoading}
                                                    >
                                                    <Image
                                                        src={`/minus-icon.svg`}
                                                        alt={`Picture of minus icon`}
                                                        width={20}
                                                        height={0}
                                                        className="aspect-[1] object-contain cursor-pointer"
                                                                                                                        
                                                        />
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-center mr-[0.5em] ml-[0.5em]">
                                                    <p>{item.amount}</p>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <button 
                                                        type="button"
                                                        onClick={() => handleAddToCart({
                                                            menuId: item.menuId,
                                                            amount: +1,
                                                            name: item.menu.name
                                                        })}
                                                        className="w-fit h-fit disabled:opacity-50"
                                                        disabled={isLoading}
                                                        >
                                                    <Image
                                                        src={`/add-icon.svg`}
                                                        alt={`Picture of add icon`}
                                                        width={35}
                                                        height={0}
                                                        className="aspect-[1] object-contain cursor-pointer"                                                                
                                                    />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex items-center justify-between px-[1.3125em] border border-[#C2C7D0] rounded-[1.125em] py-[1em] mt-[1.5em] mb-[1.8125em]  ">
                <p className="font-semibold text-[0.875rem]">Total Price</p>
                <p className="font-semibold text-[0.875rem]">₱ {myCartTotal.toFixed(2)}</p>
            </div>
        </div>

    </div>
    </div>

            { session?.orderType === OrderType.Group && <div className="flex flex-col   mt-[1.5em] rounded-[1.25em] p-[1em] bg-white ">
                <div className="flex items-center">
                    <div className="flex items-center justify-center mr-[0.62375em]">
                        <Image
                            src={showGroupsCard ? "/grayDown-icon.svg" : "/backicon-icon.svg"}
                            alt={`Picture of back icon`}
                            width={23}
                            height={0}
                            className="aspect-[1] object-contain cursor-pointer"
                            onClick={toggleGroupsCard}
                        />
                    </div>
                    <div className="flex items-center justify-center ml-[0.3125em]">
                        <p className="font-semibold text-[1.375rem]">Group&apos;s Cart</p>
                    </div>
                    <div className="flex items-center justify-center mt-[0.7em]">
                        <div className="relative">
                            <div className="absolute top-0 right-0 transform translate-x-[120%] translate-y-[-75%] bg-[#B34909] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                                {totalGroups}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Conditional rendering of payment options with transition */}
                <div
                    className={`${
                        showGroupsCard ? 'max-h-screen' : 'max-h-0 opacity-0'
                    } overflow-hidden transition-all duration-1000 ease-in-out `}
                >

                            <div className={`flex flex-col `}>
                                <div className="flex items-center justify-center">
                                    <div className={`flex flex-wrap gap-[0.625em] mt-[2em] `}>
                                        {groupCart.map(group => {
                                            const groupTotal = group.cartContents.reduce((total, item) => total + (item.amount * item.menu.price), 0);
                                            return (
                                                <div key={group._id} className="flex-1  min-w-[18em] sm:min-w-[calc(100%-20px)]  rounded-[1.125em] ">
                                                    <div className="flex flex-col ">
                                                        <div className="flex items-center">
                                                            <div className="flex flex-col ">
                                                                <div className="flex items-center justify-center">
                                                                    <Image
                                                                        src={group._id ? "/grayDown-icon.svg" : "/backicon-icon.svg"}
                                                                        alt={`Picture of toggle icon`}
                                                                        width={23}
                                                                        height={0}
                                                                        className="aspect-[1] object-contain cursor-pointer"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col  w-full ml-[0.625em]">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center justify-center ">
                                                                        <p className="font-semibold text-[1.375rem]">{group.username}</p>
                                                                    </div>
                                                                    <div className="flex items-center justify-center ">
                                                                        <p className="font-medium">₱ {groupTotal.toFixed(2)}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>



            {/* Conditional rendering of payment options with transition */}
            <div
                    className={`${
                    group._id ? 'max-h-screen' : 'max-h-0 opacity-0'
                    } overflow-hidden transition-all duration-1000 ease-in-out `}
                >

                                                        
                                                        <div className={`flex flex-col `}>
                                                            <div className="flex items-center justify-center ">
                                                                <div className={`flex flex-wrap gap-[0.625em] mt-[2em]`}>
                                                                    {group.cartContents.map((item,i) => (
                                                                        <div key={i} className="flex-1 min-w-[18em] border border-[#C2C7D0] sm:min-w-[calc(100%-20px)] rounded-[1.125em]">
                                                                            <div className="flex flex-col">
                                                                                <div className="flex items-center justify-between">
                                                                                    <div className="flex flex-col  ml-[0.625em]">
                                                                                        <div className="flex items-center justify-center">
                                                                                            <Image
                                                                                                src={item.menu.imageUrl}
                                                                                                alt={`Picture of ${item.menu.name}`}
                                                                                                width={100}
                                                                                                height={0}
                                                                                                className="aspect-[1] object-contain "
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex flex-col  mb-[0.816875em] mt-[0.816875em] mr-[0.625em]">
                                                                                        <div className="flex items-center">
                                                                                            <p className=" text-[0.875rem] font-medium">{item.menu.name}</p>
                                                                                        </div>
                                                                                        <div className="flex items-center gap-[0.5em]">
                                                                                            <div className="flex items-center justify-center">
                                                                                                <Image
                                                                                                    src={`/clock-icon.svg`}
                                                                                                    alt={`Picture of clock icon`}
                                                                                                    width={13}
                                                                                                    height={0}
                                                                                                    className="aspect-[1] object-contain"
                                                                                                />
                                                                                            </div>
                                                                                            <div className="flex items-center justify-center">
                                                                                                <p className="whitespace-nowrap text-[#A6AEBB] text-[0.75rem]">10 min</p>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="flex items-center justify-between mt-[1em] gap-[2.678125em]">
                                                                                            <div className="flex items-center justify-center">
                                                                                                <p className="font-semibold whitespace-nowrap">₱ {item.menu.price.toFixed(2)}</p>
                                                                                            </div>
                                                                                            <div className="flex items-center justify-between">
                                                                                                <div className="opacity-0 flex items-center justify-center mr-[0.09125em]">
                                                                                                    <Image 
                                                                                                        src={`/minus-icon.svg`}
                                                                                                        alt={`Picture of minus icon`}
                                                                                                        width={35}
                                                                                                        height={0}
                                                                                                        className="aspect-[1] object-contain cursor-pointer hover:border-[#C2C7D0] border border-white rounded-[0.25em] min-w-[2.1875em] px-[0.46875em]"
                                                                                                    />
                                                                                                </div>
                                                                                                <div className="flex items-center justify-center mr-[0.5em] ml-[0.5em]">
                                                                                                    <p className="font-semibold">{item.amount}x</p>
                                                                                                </div>
                                                                                                <div className="opacity-0 flex items-center justify-center">
                                                                                                    <Image
                                                                                                        src={`/add-icon.svg`}
                                                                                                        alt={`Picture of add icon`}
                                                                                                        width={35}
                                                                                                        height={0}
                                                                                                        className="aspect-[1] object-contain cursor-pointer"
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        </div>




                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                </div>



            </div>}

            <div className="flex flex-col ">
                <div className="flex items-center justify-between px-[1.3125em]  rounded-[1.125em] py-[1em] mt-[1.5em] bg-white">
                    <p className="font-semibold text-[1rem]">Total Price</p>
                    <p className="font-semibold text-[1rem]">₱ {combinedTotal.toFixed(2)}</p>
                </div>
            </div>
            {/* only the creator of the session can pay */}
            { (session && session.creator === session.user._id) && <div className="fixed bottom-[69px] left-0 w-screen h-[69px] border-t border-custom-secondary bg-white z-50 py-2 px-4">
                <Button 
                    type='button'
                    className="w-full h-full font-bold"
                    onClick={() => router.push("/app/cart/confirmation")}
                >
                    Place Order
                </Button>
            </div>}
        </div>
    );
}
