export async function sendChatMessage(
	message: string
): Promise<{ success: boolean; data?: { response: string }; message?: string }> {
	const { API_ROUTES } = await import('$lib/constants/routes');
	const res = await fetch(API_ROUTES.CHAT, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ message })
	});
	if (!res.ok) {
		throw new Error('Failed to send message');
	}
	return await res.json();
}
