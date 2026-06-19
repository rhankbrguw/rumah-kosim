import mysql from 'mysql2/promise';

async function run() {
	const connection = await mysql.createConnection({
		uri: 'mysql://root:ruko@localhost:3306/rumah_kosim'
	});
	
	try {
		await connection.execute('ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT TRUE');
		await connection.execute('ALTER TABLE users ADD COLUMN otp VARCHAR(6) NULL');
		await connection.execute('ALTER TABLE users ADD COLUMN otp_expires_at DATETIME NULL');
		await connection.execute('ALTER TABLE users ADD COLUMN reset_token VARCHAR(64) NULL');
		await connection.execute('ALTER TABLE users ADD COLUMN reset_expires_at DATETIME NULL');
		console.log('Migration successful');
	} catch (e) {
		if (e instanceof Error) {
			console.log('Migration failed or already applied:', e.message);
		} else {
			console.log('Migration failed or already applied:', String(e));
		}
	}
	
	await connection.end();
}
run();
