import { API_ROUTES } from '$lib/constants/routes.js';

export type LocationLevel = 'provinces' | 'regencies' | 'districts' | 'villages';

export type LocationOption = {
	code: string;
	name: string;
};

type LocationResponse = {
	data: LocationOption[];
};

export async function getLocationOptions(
	level: LocationLevel,
	parentCode?: string
): Promise<LocationOption[]> {
	const url = new URL(API_ROUTES.LOCATIONS, window.location.origin);
	url.searchParams.set('level', level);
	if (parentCode) url.searchParams.set('parent', parentCode);

	const response = await fetch(url);
	const payload = (await response.json()) as LocationResponse & { message?: string };
	if (!response.ok) throw new Error(payload.message || 'Unable to load location options');
	return payload.data;
}
