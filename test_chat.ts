import { chatWithAI } from './src/lib/server/services/aiService.js';
import { dbRepository } from './src/lib/server/repositories/dbRepository.js';

async function test() {
    try {
        const response = await chatWithAI('Sisa berapa deep work?');
        console.log('AI Response:', response);
    } catch (err) {
        console.error('Crash:', err);
    }
    process.exit(0);
}
test();
