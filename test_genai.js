import { GoogleGenAI, Type } from '@google/genai';
import { readFileSync } from 'fs';

// Read api key from .env
const env = readFileSync('.env', 'utf-8');
const apiKey = env.split('\n').find(l => l.startsWith('GEMINI_API_KEY=')).split('=')[1];

const ai = new GoogleGenAI({ apiKey });

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

async function test() {
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { tools: [{ functionDeclarations: [getAvailableBooksDeclaration] }] }
    });
    
    let response = await chat.sendMessage({ message: 'Sisa berapa deep work?' });
    
    if (response.functionCalls && response.functionCalls.length > 0) {
        console.log('Got function calls:', response.functionCalls);
        const call = response.functionCalls[0];
        
        response = await chat.sendMessage({
            message: [{
                functionResponse: {
                    name: call.name,
                    response: { books: [{ title: 'Deep Work', quantity: 5 }] }
                }
            }]
        });
    }
    
    console.log('Final response:', response.text);
}
test().catch(console.error);
