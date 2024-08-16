import React, { useCallback, useEffect, useState } from "react"
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel"
import { PrevButton, NextButton, usePrevNextButtons } from "@/app/(home)/codevs/components/EmblaCarouselArrowButtons"
import Autoplay from "embla-carousel-autoplay"
import useEmblaCarousel from "embla-carousel-react"
import Image from "next/image"

type PropType = {
  slides: string[]
  options: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()])
  const [activeIndex, setActiveIndex] = useState(0)

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi.plugins().autoplay
    if (!autoplay) return
  }, [])

  const { onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi, onNavButtonClick)
  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => {
      setActiveIndex(emblaApi.selectedScrollSnap())
    }
    emblaApi.on("select", onSelect)
    onSelect()
  }, [emblaApi])
  return (
    <section className=" w-full pt-8 text-white">
      <div className="relative overflow-hidden" ref={emblaRef}>
        {/* Container */}
        <div className="backface-hidden   ml-[calc(16)_*_-1] flex touch-pan-y touch-pinch-zoom">
          {/*Main Slide*/}
          {slides.map((src, index) => (
            <div className={`w-full flex-[0_0_100%]  pl-[calc(16)_*_-1]  lg:flex-[0_0_60%] `} key={index}>
              {/*Slides, the one that you are scrolling/navigating */}
              <div className={`flex w-full items-center justify-center px-2 lg:px-10 `}>
                <Image
                  src={src}
                  alt="Project Image"
                  width={1000}
                  height={500}
                  className={`${
                    index === activeIndex ? "lg:h-[35rem]" : "lg:mt-14 lg:h-[25rem] "
                  } h-[20rem] w-full rounded-lg  border  border-black-800 bg-black-600 object-cover p-4`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-row items-center justify-center gap-4 pt-14 lg:mb-10">
        <PrevButton onClick={onPrevButtonClick}>
          <Image
            src="/assets/svgs/icon-arrow-l.svg"
            alt="arrow previous"
            width={5}
            height={5}
            className="size-8 rounded-full border-2 border-light-900/15 bg-light-900/15  p-2 text-white hover:bg-light-900/5"
          />
        </PrevButton>
        <div className=" text-white">Slide to see more</div>
        <NextButton onClick={onNextButtonClick}>
          <Image
            src="/assets/svgs/icon-arrow-r.svg"
            alt="arrow next"
            width={5}
            height={5}
            className="size-8 rounded-full border-2 border-light-900/15 bg-light-900/15 p-2 text-white hover:bg-light-900/5"
          />
        </NextButton>
      </div>
    </section>
  )
}

export default EmblaCarousel
