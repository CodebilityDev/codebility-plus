'use client'
import "./productTilesStyle.css"
import React from 'react';
import { ProductCard } from './ProductCard';
import { MouseEvent } from "react";
import { IMenu } from "~/modules/menu/menu.types";
import { usePathname } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cartService } from "~/modules";
import { useToast } from "~/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useStore } from "~/hooks/useStore";

const ProductTiles = ({menus}:{menus:IMenu[]|undefined}) => {
    const pathname = usePathname()
    const session = useStore(s => s.session)
    const {toast} = useToast()

    const handleAddToCart = async (e: MouseEvent<HTMLButtonElement>, menuId: string, name: string) => {
        e.stopPropagation()
        if (!session) {
            console.error("session not found.");
            return;
        }
        if (session.orderId) {
            toast({
                title: "Order is already on the way.",
                description: "Cannot add to cart while order is on the way",
                variant: "destructive"
            })
            return
        }
        const c = await cartService.addToCart(session.cartId, {
            menuId,
            amount: 1
        })
        if (c) {
            toast({
                title: "Success",
                description: `${name} has been added to your cart.`
            })
        } else {
            toast({
                title: "Something went wrong",
                description: `Failed to add to cart.`,
                variant: "destructive"
            })
        }
    };

    const reload = () => {
        revalidatePath(pathname)
    }


    return (
        <div id="product-tiles" className="h-full items-center mb-32 max-w-xl ">
            <div className="flex flex-row items-center justify-between">
                <p className="font-bold text-lg">Popular Foods</p>
                <Link href={"/menu"} className="flex flex-row items-center gap-x-1">
                    <p className="font-semibold">See All</p>
                    <ChevronRight size={21} />
                </Link>
            </div>
            { menus ? 
            
            
            <div className="flex flex-wrap gap-[1em] mb-[3em] mt-[1.25em]">
                {menus.map((productData) => (

                        <ProductCard
                        key={productData._id}
                        {...productData}
                        onAddToCart={handleAddToCart}
                         />
                  
                ))}
            </div> 
            
            :



            <div>
                <p>Something went wrong. <button className="underline text-custom-primary" onClick={reload}>Reload</button></p>
            </div>
            }
        </div>
    );
};

export default ProductTiles;