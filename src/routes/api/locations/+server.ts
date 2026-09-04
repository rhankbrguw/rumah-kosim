import type { RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { LOCATION_LEVELS } from '$lib/constants/config.js';
import { HTTP_STATUS, ERROR_CODES } from '$lib/constants/config.js';
import { errorResponse, jsonResponse } from '$lib/server/utils/response.js';
import { logger } from '$lib/server/utils/logger.js';
import { getRedisValue, setRedisValue } from '$lib/server/utils/redisCache.js';
import { CACHE } from '$lib/constants/config.js';

const LEVEL_PATHS = {
	[LOCATION_LEVELS.PROVINCES]: 'provinces.json',
	[LOCATION_LEVELS.REGENCIES]: 'regencies',
	[LOCATION_LEVELS.DISTRICTS]: 'districts',
	[LOCATION_LEVELS.VILLAGES]: 'villages'
} as const;

function isLocationLevel(level: string): level is keyof typeof LEVEL_PATHS {
	return level in LEVEL_PATHS;
}

function buildSourceUrl(level: keyof typeof LEVEL_PATHS, parentCode?: string) {
	const baseUrl = env.WILAYAH_API_BASE_URL || 'https://wilayah.id/api';
	const path = LEVEL_PATHS[level];
	if (level === LOCATION_LEVELS.PROVINCES) return `${baseUrl}/${path}`;
	return parentCode ? `${baseUrl}/${path}/${encodeURIComponent(parentCode)}.json` : null;
}

export const GET: RequestHandler = async ({ url, fetch, setHeaders }) => {
	const level = url.searchParams.get('level') || '';
	const parentCode = url.searchParams.get('parent') || undefined;
	if (!isLocationLevel(level)) {
		return errorResponse(
			'Invalid location level',
			HTTP_STATUS.UNPROCESSABLE_ENTITY,
			ERROR_CODES.VALIDATION_ERROR
		);
	}

	const sourceUrl = buildSourceUrl(level, parentCode);
	if (!sourceUrl) {
		return errorResponse(
			'Parent location is required',
			HTTP_STATUS.UNPROCESSABLE_ENTITY,
			ERROR_CODES.VALIDATION_ERROR
		);
	}

	try {
		const cacheKey = `${CACHE.REDIS_LOCATION_PREFIX}${level}:${parentCode || 'root'}`;
		const cachedLocations = await getRedisValue<unknown[]>(cacheKey);
		if (cachedLocations) {
			setHeaders({ 'cache-control': 'public, max-age=3600, stale-while-revalidate=86400' });
			return jsonResponse(cachedLocations, 'Location options fetched successfully');
		}

		const response = await fetch(sourceUrl);
		if (!response.ok) throw new Error(`Location provider returned ${response.status}`);
		const payload = await response.json();
		const locations = payload.data || [];
		await setRedisValue(cacheKey, locations, CACHE.LOCATION_TTL_SECONDS);
		setHeaders({ 'cache-control': 'public, max-age=3600, stale-while-revalidate=86400' });
		return jsonResponse(locations, 'Location options fetched successfully');
	} catch (error) {
		logger.error('Location provider request failed:', error as Error);
		return errorResponse(
			'Unable to load location options',
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR
		);
	}
};
