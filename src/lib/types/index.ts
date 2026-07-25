export interface UserProfile {
	id: number;
	username: string;
	email: string;
	full_name: string | null;
	phone: string | null;
	avatar: string | null;
	role: 'user' | 'admin';
	address: string | null;
	is_verified: boolean;
}

export interface UserAddress {
	id: number;
	user_id: number;
	label: string;
	address_text: string;
	is_primary: boolean;
	created_at: string;
}

export interface Product {
	id: number;
	title: string;
	price: number;
	image: string;
	description: string | null;
	quantity: number;
	// join fields
	sold_count?: number;
	average_rating?: number;
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

export interface OrderItem {
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

export interface Review {
	id: number;
	order_id: number;
	product_id: number;
	user_id: number;
	rating: number;
	comment: string | null;
	created_at: string;
	// Join fields
	user_name?: string;
}

export interface ApiResponse<T = unknown> {
	success: boolean;
	code: number;
	message: string;
	data: T | null;
	meta?: Record<string, unknown>;
}
