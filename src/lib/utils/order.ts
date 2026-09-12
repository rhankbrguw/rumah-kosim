import { ORDER_STRINGS, TERMINAL_ORDER_STATUSES } from '$lib/constants/orderStrings.js';

export function getStatusColor(status: string) {
	switch (status) {
		case ORDER_STRINGS.STATUS_PROCESSING:
			return 'bg-primary/20 text-text-main border border-primary/40';
		case ORDER_STRINGS.STATUS_SHIPPED:
			return 'bg-primary text-text-inverse border border-primary';
		case ORDER_STRINGS.STATUS_DELIVERED:
			return 'bg-secondary text-text-inverse border border-secondary';
		case ORDER_STRINGS.STATUS_CANCELLED:
			return 'bg-danger/20 text-danger border border-danger/30';
		case ORDER_STRINGS.STATUS_PENDING:
			return 'bg-surface-alt text-text-muted border border-secondary/20';
		default:
			return 'bg-surface-alt text-text-muted border border-surface-alt';
	}
}

export function isOrderLocked(status: string): boolean {
	return (
		status === ORDER_STRINGS.STATUS_PENDING ||
		(TERMINAL_ORDER_STATUSES as readonly string[]).includes(status)
	);
}

export function getAvailableStatusTransitions(currentStatus: string): string[] {
	if (currentStatus === ORDER_STRINGS.STATUS_PROCESSING) {
		return [
			ORDER_STRINGS.STATUS_PROCESSING,
			ORDER_STRINGS.STATUS_SHIPPED,
			ORDER_STRINGS.STATUS_CANCELLED
		];
	}
	if (currentStatus === ORDER_STRINGS.STATUS_SHIPPED) {
		return [
			ORDER_STRINGS.STATUS_SHIPPED,
			ORDER_STRINGS.STATUS_DELIVERED,
			ORDER_STRINGS.STATUS_CANCELLED
		];
	}
	return [currentStatus];
}
