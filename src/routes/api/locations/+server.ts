import type { RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { LOCATION_LEVELS } from '$lib/constants/config.js';
import { HTTP_STATUS, ERROR_CODES } from '$lib/constants/config.js';
import { errorResponse, jsonResponse } from '$lib/server/utils/response.js';
import { logger } from '$lib/server/utils/logger.js';
import { getRedisValue, setRedisValue } from '$lib/server/utils/redisCache.js';
import { CACHE } from '$lib/constants/config.js';
import { MESSAGES } from '$lib/constants/messages.js';

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

const fetchAndCacheLocations = async (
	sourceUrl: string,
	cacheKey: string,
	fetchFn: typeof fetch
) => {
	const cached = await getRedisValue<unknown[]>(cacheKey);
	if (cached) return cached;

	const response = await fetchFn(sourceUrl);
	if (!response.ok) throw new Error(`Location provider returned ${response.status}`);
	const payload = await response.json();
	const locations = payload.data || [];
	await setRedisValue(cacheKey, locations, CACHE.LOCATION_TTL_SECONDS);
	return locations;
};

type SourceUrlResolution =
	| { success: false; error: Response }
	| { success: true; level: string; parentCode?: string; sourceUrl: string };

const resolveSourceUrl = (url: URL): SourceUrlResolution => {
	const level = url.searchParams.get('level') || '';
	const parentCode = url.searchParams.get('parent') || undefined;
	if (!isLocationLevel(level)) {
		return {
			success: false,
			error: errorResponse(
				MESSAGES.VALIDATION.LOCATION_LEVEL_INVALID,
				HTTP_STATUS.UNPROCESSABLE_ENTITY,
				ERROR_CODES.VALIDATION_ERROR
			)
		};
	}
	const sourceUrl = buildSourceUrl(level, parentCode);
	if (!sourceUrl) {
		return {
			success: false,
			error: errorResponse(
				MESSAGES.VALIDATION.LOCATION_PARENT_REQUIRED,
				HTTP_STATUS.UNPROCESSABLE_ENTITY,
				ERROR_CODES.VALIDATION_ERROR
			)
		};
	}
	return { success: true, level, parentCode, sourceUrl };
};

export const GET: RequestHandler = async ({ url, fetch: fetchFn, setHeaders }) => {
	const res = resolveSourceUrl(url);
	if (!res.success) return res.error;

	try {
		const cacheKey = `${CACHE.REDIS_LOCATION_PREFIX}${res.level}:${res.parentCode || 'root'}`;
		const locations = await fetchAndCacheLocations(res.sourceUrl, cacheKey, fetchFn);
		setHeaders({ 'cache-control': 'public, max-age=3600, stale-while-revalidate=86400' });
		return jsonResponse(locations, MESSAGES.SUCCESS.LOCATIONS_FETCHED);
	} catch (error) {
		logger.error('Location provider request failed:', error as Error);
		return errorResponse(
			MESSAGES.ERROR.LOCATION_FETCH_FAILED,
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			ERROR_CODES.INTERNAL_ERROR
		);
	}
};
