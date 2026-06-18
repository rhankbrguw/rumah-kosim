import axios from 'axios';
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';

async function testAddToCart() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rumah_kosim'
  });

  try {
    const [users] = await connection.execute('SELECT * FROM users LIMIT 1');
    const user = users[0];
    console.log('User ID:', user.id);

    const [products] = await connection.execute('SELECT * FROM products LIMIT 1');
    const product = products[0];
    console.log('Product ID:', product.id);

    await connection.execute('CALL add_to_cart(?, ?, ?)', [user.id, product.id, 1]);
    console.log('Successfully called add_to_cart');
  } catch (err) {
    console.error('Error calling add_to_cart:', err);
  } finally {
    await connection.end();
  }
}

testAddToCart();
