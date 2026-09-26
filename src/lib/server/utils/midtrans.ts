import midtransClient from 'midtrans-client';
import { MIDTRANS_SERVER_KEY, MIDTRANS_IS_PRODUCTION } from '$env/static/private';
import { PUBLIC_MIDTRANS_CLIENT_KEY } from '$env/static/public';
import {
	MIDTRANS_TRANSACTION_STATUS,
	MIDTRANS_FRAUD_STATUS,
	ORDER_STRINGS
} from '$lib/constants/orderStrings.js';

export const snap = new midtransClient.Snap({
	isProduction: MIDTRANS_IS_PRODUCTION === 'true',
	serverKey: MIDTRANS_SERVER_KEY,
	clientKey: PUBLIC_MIDTRANS_CLIENT_KEY
});

export const resolvePaymentStatus = (transactionStatus: string, fraudStatus?: string): string => {
	const s = String(transactionStatus || '').toLowerCase();
	const f = String(fraudStatus || '').toLowerCase();

	if (s === MIDTRANS_TRANSACTION_STATUS.CAPTURE || s === 'capture') {
		return f === MIDTRANS_FRAUD_STATUS.CHALLENGE
			? ORDER_STRINGS.STATUS_PROCESSING
			: ORDER_STRINGS.STATUS_PROCESSING;
	}
	if (
		s === MIDTRANS_TRANSACTION_STATUS.SETTLEMENT ||
		s === 'settlement' ||
		s === 'success' ||
		s === '200'
	) {
		return ORDER_STRINGS.STATUS_PROCESSING;
	}
	if (
		['cancel', 'deny', 'expire'].includes(s) ||
		[
			MIDTRANS_TRANSACTION_STATUS.CANCEL,
			MIDTRANS_TRANSACTION_STATUS.DENY,
			MIDTRANS_TRANSACTION_STATUS.EXPIRE
		].includes(s as 'cancel' | 'deny' | 'expire')
	) {
		return ORDER_STRINGS.STATUS_CANCELLED;
	}
	return ORDER_STRINGS.STATUS_PENDING;
};
