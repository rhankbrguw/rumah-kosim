import mysql from 'mysql2/promise';

async function test() {
	const pool = mysql.createPool({
		uri: 'mysql://root:ruko@localhost:3306/rumah_kosim'
	});
	
	try {
		console.log('Testing create user...');
		const [countRows] = await pool.query('SELECT COUNT(*) as count FROM users');
		const isFirstUser = (countRows as any)[0].count === 0;
		const role = isFirstUser ? 'admin' : 'user';
		const isVerified = isFirstUser ? true : false;
		
		console.log('isFirstUser:', isFirstUser);

		const sql = `INSERT INTO users (username, password, email, role, is_verified) VALUES (?, ?, ?, ?, ?)`;
		await pool.query(sql, ['testuser', 'hashedpassword', 'test@example.com', role, isVerified]);
		
		console.log('Insert successful!');
		
		const otp = Math.floor(100000 + Math.random() * 900000).toString();
		const expiresAt = new Date(Date.now() + 5 * 60000);
		
		const [rows]: any = await pool.query('SELECT id FROM users WHERE username = ?', ['testuser']);
		const userId = rows[0].id;
		
		console.log('Updating OTP for user', userId, 'expires at', expiresAt);
		
		await pool.query(`UPDATE users SET otp = ?, otp_expires_at = ? WHERE id = ?`, [otp, expiresAt, userId]);
		console.log('Update successful!');
		
	} catch (e) {
		console.error('Failed:', e);
	}
	
	await pool.end();
}

test();
