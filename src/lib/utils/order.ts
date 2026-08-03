export function getStatusColor(status: string) {
	switch (status) {
		case 'Processing':
			return 'bg-primary text-text-inverse';
		case 'Shipped':
			return 'bg-primary-hover text-text-inverse';
		case 'Delivered':
			return 'bg-secondary text-text-inverse';
		case 'Cancelled':
			return 'bg-danger text-text-inverse';
		default:
			return 'bg-surface-alt text-text-main';
	}
}
