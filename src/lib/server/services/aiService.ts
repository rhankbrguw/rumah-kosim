import { GoogleGenAI, Type } from '@google/genai';
import { GEMINI_API_KEY } from '$env/static/private';
import { APP_CONFIG } from '$lib/constants/config.js';
import { dbRepository } from '../repositories/dbRepository.js';
import { logger } from '../utils/logger.js';
import type { RowDataPacket } from 'mysql2';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const getAvailableBooksDeclaration = {
	name: 'getAvailableBooks',
	description: 'Search for available books in stock based on a search query or get a list of books if no query is provided.',
	parameters: {
		type: Type.OBJECT,
		properties: {
			query: {
				type: Type.STRING,
				description: 'Optional search query for book title or description. E.g., "Deep Work", "History".'
			}
		}
	}
};

async function executeGetAvailableBooks(query?: string) {
	try {
		let sql = 'SELECT id, title, description, price, quantity FROM products WHERE quantity > 0';
		let params: any[] = [];
		if (query) {
			sql += ' AND (title LIKE ? OR description LIKE ?)';
			const q = `%${query}%`;
			params = [q, q];
		}
		sql += ' LIMIT 5';
		
		const rows = await dbRepository.query(sql, params) as RowDataPacket[];
		if (rows.length === 0) {
			return { message: 'No books found matching the query.' };
		}
		return { books: rows };
	} catch (e) {
		logger.error('Error executing getAvailableBooks', e as Error);
		return { error: 'Failed to retrieve books from the database.' };
	}
}

async function handleFunctionCalls(chat: any, response: any) {
	if (response.functionCalls && response.functionCalls.length > 0) {
		for (const call of response.functionCalls) {
			if (call.name === 'getAvailableBooks') {
				const args = call.args as any;
				const result = await executeGetAvailableBooks(args.query);
				response = await chat.sendMessage({
					message: [{ functionResponse: { name: call.name, response: result } }] as any
				});
			}
		}
	}
	return response;
}

export async function chatWithAI(userMessage: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
	try {
		const formattedHistory = history.map(msg => ({
			role: msg.role,
			parts: msg.parts
		}));

		const chat = ai.chats.create({
			model: 'gemini-2.5-flash',
			history: formattedHistory,
			config: {
				systemInstruction: APP_CONFIG.AI_SYSTEM_INSTRUCTION,
				tools: [{ functionDeclarations: [getAvailableBooksDeclaration] }],
				temperature: 0.2
			}
		});

		let response = await chat.sendMessage({ message: userMessage });
		response = await handleFunctionCalls(chat, response);

		return response.text;
	} catch (error) {
		logger.error('AI Chat Error', error as Error);
		return 'I apologize, but I am currently experiencing technical difficulties connecting to our systems. Please try again later.';
	}
}
