import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'rhankbrguwdev@gmail.com',
		pass: 'fbnu tzqh asld embx'
	}
});

async function test() {
	try {
		console.log('Sending email...');
		await transporter.sendMail({
			from: '"Rumah-Kosim Team" <rhankbrguwdev@gmail.com>',
			to: 'rhankbrguwdev@gmail.com',
			subject: 'Test Email',
			text: 'This is a test email'
		});
		console.log('Email sent successfully!');
	} catch (e) {
		console.error('Email failed:', e);
	}
}

test();
