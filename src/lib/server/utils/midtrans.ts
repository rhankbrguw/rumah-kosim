import midtransClient from 'midtrans-client';
import { MIDTRANS_SERVER_KEY, MIDTRANS_IS_PRODUCTION } from '$env/static/private';
import { PUBLIC_MIDTRANS_CLIENT_KEY } from '$env/static/public';

// Initialize Midtrans Snap client instance
export const snap = new midtransClient.Snap({
    isProduction: MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: MIDTRANS_SERVER_KEY,
    clientKey: PUBLIC_MIDTRANS_CLIENT_KEY
});
