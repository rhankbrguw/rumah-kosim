import { dbRepository } from './src/lib/server/repositories/dbRepository.js';
import { UserRepository } from './src/lib/server/repositories/userRepository.js';
import { sendOrderConfirmationEmail } from './src/lib/server/utils/mailer.js';

async function test() {
  console.log('Testing...');
  try {
    const userId = 1;
    const user = await UserRepository.getById(userId);
    console.log('User:', user);
    if (user && user.email) {
      console.log('Attempting to send email to:', user.email);
      await sendOrderConfirmationEmail(user.email, 100000, 'RK123456789');
      console.log('Email sent successfully!');
    } else {
      console.log('No user or email found!');
    }
  } catch (e) {
    console.error('Error:', e);
  } finally {
    process.exit(0);
  }
}
test();
