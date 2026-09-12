import { GoogleGenAI, Type } from '@google/genai';
import { GEMINI_API_KEY } from '$env/static/private';
import { APP_CONFIG, AI } from '$lib/constants/config.js';
import { ProductRepository } from '../repositories/productRepository.js';
import { logger } from '../utils/logger.js';
import type { RowDataPacket } from 'mysql2';
import { InternalException } from '../utils/exceptions.js';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const getAvailableBooksDeclaration = {
	name: 'getAvailableBooks',
	description:
		'Search for available books in stock based on a search query or get a list of books if no query is provided.',
	parameters: {
		type: Type.OBJECT,
		properties: {
			query: {
				type: Type.STRING,
				description:
					'Optional search query for book title or description. E.g., "Deep Work", "History".'
			}
		}
	}
};

async function executeGetAvailableBooks(query?: string) {
	try {
		const rows = (await ProductRepository.searchAvailable(query)) as RowDataPacket[];
		if (rows.length === 0) {
			return { message: 'No books found matching the query.' };
		}
		return { books: rows };
	} catch (e) {
		logger.error('Error executing getAvailableBooks', e as Error);
		return { error: 'Failed to retrieve books from the database.' };
	}
}

type ChatSession = { sendMessage(params: { message: string | unknown[] }): Promise<ChatResponse> };
type ChatResponse = {
	text?: string;
	functionCalls?: { name: string; args: Record<string, unknown> }[];
	data?: unknown;
	executableCode?: unknown;
	codeExecutionResult?: unknown;
};

async function handleFunctionCalls(
	chat: ChatSession,
	response: ChatResponse
): Promise<ChatResponse> {
	if (response.functionCalls && response.functionCalls.length > 0) {
		for (const call of response.functionCalls) {
			if (call.name === 'getAvailableBooks') {
				const result = await executeGetAvailableBooks(call.args.query as string);
				response = (await chat.sendMessage({
					message: [{ functionResponse: { name: call.name, response: result } }]
				})) as ChatResponse;
			}
		}
	}
	return response;
}

export async function chatWithAI(
	userMessage: string,
	history: { role: 'user' | 'model'; parts: { text: string }[] }[] = []
) {
	try {
		const formattedHistory = history.map((msg) => ({
			role: msg.role,
			parts: msg.parts
		}));

		const chat = ai.chats.create({
			model: AI.MODEL_NAME,
			history: formattedHistory,
			config: {
				systemInstruction: APP_CONFIG.AI_SYSTEM_INSTRUCTION,
				tools: [{ functionDeclarations: [getAvailableBooksDeclaration] }],
				temperature: AI.TEMPERATURE
			}
		});

		let response = (await chat.sendMessage({ message: userMessage })) as ChatResponse;
		response = await handleFunctionCalls(chat as unknown as ChatSession, response);

		return response.text;
	} catch (error) {
		logger.error('AI Chat Error', error as Error);
		throw new InternalException('AI Chat Service is currently unavailable.');
	}
}
