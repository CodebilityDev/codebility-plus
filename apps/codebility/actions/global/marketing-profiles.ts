"use server";

import type { Codev } from "@/types/global/codev";
import { getCodevSummary } from "@/lib/global/codev-service";

export async function getCodev(id: string): Promise<Codev | null> {
	const { data, error } = await getCodevSummary(id);

	if (error) {
		console.error("Failed to fetch Codev data:", error);
		return null;
	}

	if (!data) {
		return null;
	}

	return data as Codev;
}
