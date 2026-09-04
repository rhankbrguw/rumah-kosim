export interface UserAddress {
	id: number;
	user_id: number;
	label: string;
	address_text: string;
	is_primary: boolean;
	created_at: string;
}

export interface CartItem {
	user_id: number;
	product_id: number;
	quantity: number;
	// Join fields
	title?: string;
	price: number;
	image?: string;
}

interface OrderItem {
	id: number;
	order_id: number;
	product_id: number;
	quantity: number;
	price_at_time: number;
	// Join fields
	title?: string;
	image?: string;
	reviewed?: boolean;
	review?: {
		rating?: number;
		comment?: string;
	};
}

export interface Order {
	id: number;
	user_id: number | null;
	total: number;
	shipping_address: string;
	shipping_price: number;
	shipping_method: string;
	tracking_number: string | null;
	date: string;
	status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | string;
	// Join fields
	items?: OrderItem[];
	username?: string;
	title?: string;
	quantity?: number;
	price_at_time?: number;
}
