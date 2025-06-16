"use client";

import { useModal } from "@/hooks/use-modal";
import { cn } from "@codevs/ui";
import { Button } from "@codevs/ui/button";

interface CodevHireCodevButtonProps {
	codevId: string;
	hovered: boolean;
}

export function CodevHireCodevButton({
	codevId,
	hovered,
}: CodevHireCodevButtonProps) {
	const { onOpen } = useModal();

	return (
		<>
			<Button
				variant="purple"
				size="sm"
				className={cn(
					"py-0 px-3 text-sm rounded-md hover:bg-purple-600 transition-opacity duration-200",
					hovered ? "opacity-100" : "opacity-0",
				)}
				onClick={() => onOpen("marketingCodevHireCodevModal", codevId)}
			>
				Hire Me
			</Button>
		</>
	);
}
