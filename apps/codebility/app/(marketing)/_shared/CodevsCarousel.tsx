"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";

import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./CodevsEmblaCarouselArrowButtons";

type PropType = {
  slides: string[];
  options: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({
      stopOnInteraction: true,
    }),
  ]);
  const [activeIndex, setActiveIndex] = useState(0);

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi.plugins().autoplay;
    if (!autoplay) return;

    // Stop autoplay when button is clicked
    autoplay.stop();

    // Resume autoplay after 10s seconds
    setTimeout(() => {
      autoplay.play();
    }, 10000);
  }, []);

  const { onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(
    emblaApi,
    onNavButtonClick,
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setActiveIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);
  return (
    <section className=" w-full pt-8 text-white">
      <div className="relative overflow-hidden" ref={emblaRef}>
        {/* Container */}
        <div className="backface-hidden   ml-[calc(16)_*_-1] flex touch-pan-y touch-pinch-zoom">
          {/*Main Slide*/}
          {slides.map((src, index) => (
            <div
              className={`w-full flex-[0_0_100%]  pl-[calc(16)_*_-1]  lg:flex-[0_0_60%] `}
              key={index}
            >
              {/*Slides, the one that you are scrolling/navigating */}
              <div
                className={`flex w-full items-center justify-center px-2 lg:px-10 `}
              >
                <Image
                  src={src}
                  alt="Project Image"
                  width={1000}
                  height={500}
                  onError={(e) => {
                    console.error('Failed to load image:', src);
                    // Replace with fallback image
                    const target = e.target as HTMLImageElement;
                    target.src = '/assets/images/index/projects-large.jpg';
                  }}
                  className={`${
                    index === activeIndex
                      ? "lg:h-[30rem]"
                      : "lg:mt-10 lg:h-[22rem] "
                  } border-black-800 bg-black-600 h-[18rem]  w-full  rounded-lg border object-cover p-4`}
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
            className="border-light-900/15 bg-light-900/15 hover:bg-light-900/5 size-8 rounded-full  border-2 p-2 text-white"
            
          />
        </PrevButton>
        <div className=" text-white">Slide to see more</div>
        <NextButton onClick={onNextButtonClick}>
          <Image
            src="/assets/svgs/icon-arrow-r.svg"
            alt="arrow next"
            width={5}
            height={5}
            className="border-light-900/15 bg-light-900/15 hover:bg-light-900/5 size-8 rounded-full border-2 p-2 text-white"
            
          />
        </NextButton>
      </div>
    </section>
  );
};

export default EmblaCarousel;
