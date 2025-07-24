"use client";

import { Codev } from "@/types/home/codev";
import { cn } from "@codevs/ui";
import Image from "next/image";

// Utility function to capitalize the first letter of each word
const capitalizeWords = (text: string) => {
	return text
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
};

const AdminCard = ({ admin, color }: { admin: Codev; color: string }) => {
	const defaultImage = "/assets/svgs/icon-codebility-black.svg";

	return (
		<div>
			<div className="flex h-full w-full flex-col gap-4 rounded-lg ">
				<div className={cn("relative h-[250px] w-full rounded-lg", color)}>
          <Image
            alt={`${admin.first_name} Avatar`}
            src={admin.image_url || defaultImage}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            
            className="rounded-lg object-cover"
            onError={(e) => {
              e.currentTarget.src = defaultImage;
            }}
          />
        </div>
				<div className="flex w-full flex-col gap-1">
					<p className="md:text-md text-sm text-white lg:text-lg">
						{capitalizeWords(admin.first_name)}{" "}
						{capitalizeWords(admin.last_name)}
					</p>
					<div className="min-h-[2.5rem]">
						{admin.display_position ? (
							<p className="text-gray text-sm lg:text-base">
								{admin.display_position}
							</p>
						) : (
							<div className="text-sm lg:text-base">&nbsp;</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminCard;
