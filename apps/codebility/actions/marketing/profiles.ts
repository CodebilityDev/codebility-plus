"use server";

import { Codev } from "@/types/home/codev";
import { getCodevs } from "@/lib/server/codev.service";

export async function getCodev(id: string): Promise<Codev | null> {
	const { data, error } = await getCodevs({ filters: { id } });

	if (error) {
		console.error("Failed to fetch Codev data:", error);
		return null;
	}

	if (!data || data.length === 0) {
		return null;
	}

	return data[0] || null;
}
