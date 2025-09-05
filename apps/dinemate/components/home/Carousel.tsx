"use client"
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "~/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Button } from "@codevs/ui/button"


export default function CarouselComponent() {

  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [, setCount] = useState(0)
  const [dotArray, setDotArray] = useState<number[]>([])

  function scrollToIndex(index:number) {
    if (!api) return;
    setCurrent(index)
    api.scrollTo(index-1)
  }

  useEffect(() => {
    if (!api) return
    const length = api.scrollSnapList().length
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
    const arr = Array.from({length}, (_,i) => i+1)
    setDotArray(arr)
    api.on("select", () => setCurrent(api.selectedScrollSnap()+1))
  }, [api])

  return (
    <Carousel
    opts={{loop: true}}
    plugins={[Autoplay({delay:5000, stopOnInteraction:false})]}
    setApi={setApi}
    className="max-w-xl"
    >
      <CarouselContent className="-ml-2">
        {
          bannerImagesLink.map((l,i) => (
            <CarouselItem key={l} className={`basis-10/12 pl-2 aspect-[2.35]`}>
          <div className="w-full aspect-[2.35]">
          <Image
          src={l}
          alt="carousel image"
          width={334}
          height={142}
          className={`w-full aspect-[2.35] object-cover ${i+1 === current ? "scale-100" : "scale-90"} transition-all duration-150 rounded-3xl`}
          />
          </div>
        </CarouselItem>
          ))
        }     
      </CarouselContent>      
      <div className="w-full py-2 flex flex-row gap-x-2 justify-center">
        {
          dotArray.map(v => (
            <Button 
            key={v}  
            size={"icon"} 
            className={`w-3 h-3 rounded-full ${v === current ? "bg-custom-primary" : "bg-custom-border"} active:bg-custom-border`}
            onClick={() => scrollToIndex(v)}
            >

            </Button>
          ))
        }          
      </div>
    </Carousel>
  )
}


const bannerImagesLink = [
  "/banner-1.png",
  "/banner-2.png",
  "/banner-3.png",
]