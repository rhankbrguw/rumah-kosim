import { env } from '$env/dynamic/private';
import { CACHE } from '$lib/constants/config.js';
import { logger } from './logger.js';

function getRedisConfig() {
	const url = env.UPSTASH_REDIS_REST_URL || env.REDIS_REST_URL;
	const token = env.UPSTASH_REDIS_REST_TOKEN || env.REDIS_REST_TOKEN;
	if (!url || !token) return null;
	return { url, token };
}

async function executeRedisCommand(command: unknown[]) {
	const config = getRedisConfig();
	if (!config) return null;

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), CACHE.REDIS_TIMEOUT_MS);
	try {
		const response = await fetch(config.url, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${config.token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(command),
			signal: controller.signal
		});
		if (!response.ok) throw new Error(`Redis returned ${response.status}`);
		return (await response.json()) as { result?: unknown };
	} finally {
		clearTimeout(timeout);
	}
}

export async function getRedisValue<T>(key: string): Promise<T | null> {
	try {
		const response = await executeRedisCommand(['GET', key]);
		if (!response?.result || typeof response.result !== 'string') return null;
		return JSON.parse(response.result) as T;
	} catch (error) {
		logger.warn('Redis read skipped', {
			key,
			error: error instanceof Error ? error.message : error
		});
		return null;
	}
}

export async function setRedisValue(key: string, value: unknown, ttlSeconds: number) {
	try {
		await executeRedisCommand(['SET', key, JSON.stringify(value), 'EX', ttlSeconds]);
	} catch (error) {
		logger.warn('Redis write skipped', {
			key,
			error: error instanceof Error ? error.message : error
		});
	}
}

export async function deleteRedisPattern(pattern: string) {
	try {
		const res = await executeRedisCommand(['KEYS', pattern]);
		if (Array.isArray(res?.result) && res.result.length > 0) {
			await executeRedisCommand(['DEL', ...res.result]);
		}
	} catch (error) {
		logger.warn('Redis pattern delete skipped', {
			pattern,
			error: error instanceof Error ? error.message : error
		});
	}
}
