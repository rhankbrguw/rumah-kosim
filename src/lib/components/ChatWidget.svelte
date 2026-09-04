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

<div class="fixed bottom-3 right-3 z-50 flex flex-col items-end sm:bottom-6 sm:right-6">
	{#if isOpen}
		<div
			in:scale={{ duration: 200, start: 0.95 }}
			out:scale={{ duration: 150, start: 0.95 }}
			class="mb-3 flex h-[72vh] max-h-[500px] w-[calc(100vw-24px)] max-w-sm flex-col overflow-hidden rounded-2xl border border-surface-alt bg-surface/95 shadow-2xl backdrop-blur-xl sm:mb-4"
		>
			<ChatHeader {toggleChat} />

			<div bind:this={chatContainer} class="flex-1 space-y-3 overflow-y-auto p-3 sm:p-4">
				{#each messages as msg, idx (idx)}
					<div class="flex flex-col {msg.role === 'user' ? 'items-end' : 'items-start'}">
						<div
							class="max-w-[88%] rounded-2xl px-3.5 py-2.5 shadow-sm {msg.role === 'user'
								? 'rounded-tr-sm bg-primary text-secondary'
								: 'rounded-tl-sm border border-surface-alt bg-surface-alt/50 text-text-main'}"
						>
							{#if msg.role === 'model'}
								<div class="space-y-1.5 text-xs leading-relaxed tracking-normal sm:text-sm">
									{#each msg.text.split('\n') as line, lIdx (lIdx)}
										{#if line.trim()}
											<p>{line.replace(/\*/g, '')}</p>
										{/if}
									{/each}
								</div>
							{:else}
								<p class="text-xs sm:text-sm">{msg.text}</p>
							{/if}
						</div>
					</div>
				{/each}

				{#if isLoading}
					<div class="flex items-start">
						<div
							class="rounded-2xl rounded-tl-sm border border-surface-alt bg-surface-alt/50 px-3.5 py-2 shadow-sm"
						>
							<div class="flex items-center gap-1">
								<div class="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted"></div>
								<div class="delay-2 h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted"></div>
								<div class="delay-4 h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted"></div>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<div class="shrink-0 border-t border-surface-alt bg-surface/80 p-2.5 sm:p-3">
				<div class="relative flex items-center">
					<textarea
						bind:value={message}
						on:keydown={handleKeydown}
						placeholder={STRINGS.AI_CS.PLACEHOLDER}
						class="w-full resize-none rounded-xl border border-surface-alt bg-surface py-2 pl-3 pr-10 text-xs text-text-main focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
						rows="1"
					></textarea>
					<button
						on:click={sendMessage}
						disabled={!message.trim() || isLoading}
						class="absolute right-1.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg bg-primary text-secondary transition-all hover:bg-primary-hover disabled:opacity-40"
						title="Send Message"
					>
						<Send size={14} />
					</button>
				</div>
			</div>
		</div>
	{/if}

	<button
		on:click={toggleChat}
		class="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-primary text-secondary shadow-lg transition-transform duration-150 hover:scale-105 active:scale-95 sm:h-14 sm:w-14"
		title={isOpen ? 'Close Chat' : 'Open AI Support'}
	>
		{#if isOpen}
			<X size={20} class="transition-transform group-hover:rotate-90" />
		{:else}
			<MessageCircle size={22} class="transition-transform group-hover:scale-105" />
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
