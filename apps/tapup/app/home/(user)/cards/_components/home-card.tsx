import React from "react";
import Link from "next/link";
import { CircleUserRound, PenLine } from "lucide-react";

import { Button } from "@codevs/ui/button";

import pathsConfig from "~/config/paths.config";
import Card from "~/types/cards";
import HomeActivateCardModal from "../../../_components/home-activate-card-modal";

interface CardProps {
  card: Card;
  className?: string;
  height?: string;
  width?: string;
}

const HomeCard = ({ card, className, height, width }: CardProps) => {
  const { id, name, industry, status, username_url } = card;
  return (
    <div
      className={`flex h-[15vw] w-[24vw] flex-col justify-between rounded-[20px] bg-card p-6 text-foreground ${className}`}
      style={{ width: width, height: height }}
    >
      <div className="flex justify-between">
        <div className="text-xs">
          {!status && (
            <HomeActivateCardModal cardId={id}>
              <Button className="h-0 p-0 text-xs text-foreground underline">
                Activate Card
              </Button>
            </HomeActivateCardModal>
          )}
        </div>
        <div className="flex flex-1 flex-col items-end">
          <p className="text-xs font-bold">{name}</p>
          <p className="text-[10px]">{industry}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <Link href={pathsConfig.app.builder + `/${id}`}>
            <CircleUserRound className="size-5" />
          </Link>
        </div>
        <div className="flex items-center justify-between gap-x-2">
          <Link
            href={username_url || "#"}
            className="text-[8px] text-foreground/60"
          >
            {status ? "http://localhost:3000" : "Activate to set profile URL"}
          </Link>
          <Button disabled={!status} className="h-0 p-0">
            <Link
              href="#"
              className="text-right text-foreground/60"
              aria-disabled
            >
              <PenLine size={10} className="text-foreground/60" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeCard;
