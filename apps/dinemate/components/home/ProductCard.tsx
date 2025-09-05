'use client'
import React, { MouseEvent, useState } from 'react';
import { Plus, Star } from 'lucide-react';
import Image from 'next/image';
import { IMenu } from '@/modules/menu/menu.types';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';

export interface IProductCard extends IMenu {
    onAddToCart: (e:MouseEvent<HTMLButtonElement>, menuId: string, name: string) => Promise<void>;
}



export const ProductCard = ({ _id ,name, price, imageUrl, ratingAverage, onAddToCart }: IProductCard) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)


    const handleAddToCart = async (e:MouseEvent<HTMLButtonElement>, menuId: string, name:string) => {
        setIsLoading(true)
        await onAddToCart(e, menuId, name)
        setIsLoading(false)
    }

    return (
    //   <div role='button' tabIndex={0} className="h-[170px] aspect-[11/12] rounded-3xl border items-center justify-center shadow-sm"
    <div role='button' tabIndex={0} className="flex-1 min-w-[9.9375em] border border-[#C2C7D0] rounded-[1.5em]  sm:min-w-[calc(50%-20px)]"
      onClick={() => router.push(`/menu/${_id}`)}
      >
            {/* <div className="flex flex-row pt-3 px-4 items-center gap-1"> */}
                {/* <Star size={10} color="#F6C668" />
                <div className="text-[10px] sm:text-xs font-medium"> */}
                    {/* TODO: update */} 
                    {/* {ratingAverage?.toFixed(1)}
                    {((Math.random()*4)+1).toFixed(1)}
                {/* </div> */}
            {/* </div> */}



                <div className="flex items-center mt-[0.551875em] mx-[1em] ">
                              <Image
                                  src={`/yellowStar-icon.svg`}
                                  alt="Picture of the food"
                                  width={18}
                                  height={18}
                                  className="aspect-[1.4] object-contain ml-[-0.2em] mr-[0.125em]"
                              />
                              <div className="text-[0.625rem] leading-[1.3125em] font-medium mt-[0.2em]">

                     {ratingAverage?.toFixed(1)}

                              </div>
                          </div>

                            {/* <div className="flex items-center justify-center mt-4">
                <Image
                    src={imageUrl}
                    alt="Picture of the food"
                    width={86}
                    height={68}
                    className="aspect-[1.4] object-contain"
                />
            </div> */}




<div className="flex items-center justify-center mt-[0.551875em] mb-[0.551875em]">
                              <Image
                                  src={imageUrl}
                                  alt="Picture of the food"
                                  width={120}
                                  height={0}
                                  className="aspect-[1.4] object-contain "
                              />
                          </div>



            {/* <div className="px-4"> */}
                {/* <div className="mt-2">
                    <div className="text-xs sm:text-sm md:text-base mb-[2px]">{name}</div>
                </div> */}




<div className="flex items-center mx-[1em] ">
      
      <p className="text-[0.75rem] font-medium">{name} </p>


    </div>


                {/* <div className="flex-row flex items-center justify-between">
                    <div className="font-semibold text-xs sm:text-sm md:text-base">₱ {Number(price.toFixed(2)).toLocaleString()}</div>
                    <button
                        onClick={(e) => handleAddToCart(e,_id, name)}
                        className="bg-[#FF680D] rounded-2xl p-1 sm:p-2 md:p-3 relative left-[10px] disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {
                            isLoading ?
                            <Loader color="white" size={16} className='animate-spin' /> :
                            <Plus color="white" size={16} />
                        }
                    </button>
                </div> */}


<div className="flex items-center justify-between ml-[1em]  mb-[0.71875em]  ">
      
      <div className="font-semibold text-[0.75rem]">₱ {Number(price.toFixed(2)).toLocaleString()}</div>

       <button className="cursor-pointer transform active:scale-95 transition-transform duration-200 disabled:opacity-50"
       onClick={(e) => handleAddToCart(e,_id, name)}
       disabled={isLoading}
       >
       
       <Image
        src={`addbutton-icon.svg`}
        alt="Picture of the food"
        width={45}
        height={0}
        className="aspect-[1.4] object-contain "
    />

       </button>
</div>



                </div>


        // </div>
    );
}