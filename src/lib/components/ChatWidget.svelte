<script lang="ts">
	import { MessageCircle, X, Send } from 'lucide-svelte';
	import { scale } from 'svelte/transition';
	import { afterUpdate } from 'svelte';
	import { STRINGS } from '$lib/constants/strings';
	import { sendChatMessage } from '$lib/services/aiService';
	import ChatHeader from './ChatHeader.svelte';

	let isOpen = false;
	let message = '';
	let messages: { role: 'model' | 'user'; text: string }[] = [
		{ role: 'model', text: STRINGS.AI_CS.GREETING }
	];
	let isLoading = false;
	let chatContainer: HTMLDivElement;

	function toggleChat() {
		isOpen = !isOpen;
	}

	async function sendMessage() {
		if (!message.trim()) return;

		const userText = message;
		messages = [...messages, { role: 'user', text: userText }];
		message = '';
		isLoading = true;

		try {
			const payload = await sendChatMessage(userText);
			if (payload.success && payload.data && payload.data.response) {
				messages = [...messages, { role: 'model', text: payload.data.response }];
			} else {
				messages = [...messages, { role: 'model', text: STRINGS.AI_CS.ERROR_SERVER }];
			}
		} catch (_error) {
			// Ignore message parsing errors, chat will be empty
			messages = [...messages, { role: 'model', text: STRINGS.AI_CS.ERROR_CONNECTION }];
		} finally {
			isLoading = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	}

	afterUpdate(() => {
		if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
	});
</script>

<div class="fixed bottom-4 right-4 z-50 flex flex-col items-end sm:bottom-6 sm:right-6">
	{#if isOpen}
		<div
			in:scale={{ duration: 300, start: 0.9 }}
			out:scale={{ duration: 200, start: 0.9 }}
			class="mb-4 flex h-[70dvh] max-h-[600px] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-surface-alt/50 bg-surface/90 shadow-2xl backdrop-blur-xl sm:h-[500px] sm:w-[400px]"
		>
			<!-- Header -->
			<ChatHeader {toggleChat} />

			<!-- Chat Area -->
			<div bind:this={chatContainer} class="flex-1 space-y-4 overflow-y-auto p-5">
				{#each messages as msg}
					<div class="flex flex-col {msg.role === 'user' ? 'items-end' : 'items-start'}">
						<div
							class="max-w-[85%] rounded-2xl px-4 py-3 shadow-sm {msg.role === 'user'
								? 'rounded-tr-sm bg-primary text-secondary'
								: 'rounded-tl-sm border border-surface-alt bg-surface-alt/50 text-text-main'}"
						>
							{#if msg.role === 'model'}
								<div class="space-y-2 text-justify text-sm leading-relaxed tracking-wide">
									{#each msg.text.split('\n') as line}
										{#if line.trim()}
											<p>{line.replace(/\*/g, '')}</p>
										{/if}
									{/each}
								</div>
							{:else}
								<p class="text-sm">{msg.text}</p>
							{/if}
						</div>
					</div>
				{/each}

				{#if isLoading}
					<div class="flex items-start">
						<div
							class="rounded-2xl rounded-tl-sm border border-surface-alt bg-surface-alt/50 px-4 py-3 shadow-sm"
						>
							<div class="flex items-center gap-1">
								<div class="h-2 w-2 animate-bounce rounded-full bg-text-muted"></div>
								<div class="delay-2 h-2 w-2 animate-bounce rounded-full bg-text-muted"></div>
								<div class="delay-4 h-2 w-2 animate-bounce rounded-full bg-text-muted"></div>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Input Area -->
			<div class="border-t border-surface-alt bg-surface/50 p-4">
				<div class="relative flex items-center">
					<textarea
						bind:value={message}
						on:keydown={handleKeydown}
						placeholder={STRINGS.AI_CS.PLACEHOLDER}
						class="w-full resize-none rounded-xl border border-surface-alt bg-surface py-3 pl-4 pr-12 text-sm text-text-main focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						rows="1"
					></textarea>
					<button
						on:click={sendMessage}
						disabled={!message.trim() || isLoading}
						class="absolute right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-primary text-secondary transition-all duration-200 hover:bg-primary-hover disabled:opacity-50"
					>
						<Send size={16} />
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Floating Button -->
	<button
		on:click={toggleChat}
		class="group flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primary text-secondary shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
	>
		{#if isOpen}
			<X size={24} class="transition-transform group-hover:rotate-90" />
		{:else}
			<MessageCircle size={24} class="transition-transform group-hover:scale-110" />
		{/if}
	</button>
</div>

<style>
	.delay-2 {
		animation-delay: 0.2s;
	}
	.delay-4 {
		animation-delay: 0.4s;
	}
</style>
