import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'rhankbrguwdev@gmail.com',
		pass: 'fbnu tzqh asld embx'
	}
});

async function test() {
  console.log('Sending...');
  try {
    await transporter.sendMail({
      from: '"Rumah-Kosim Team" <rhankbrguwdev@gmail.com>',
      to: 'rhankbrguwdev@gmail.com',
      subject: 'Test',
      html: '<b>Works!</b>'
    });
    console.log('Sent!');
  } catch(e) {
    console.error(e);
  }
}
test();
