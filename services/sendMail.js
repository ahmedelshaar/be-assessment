import nodemailer from 'nodemailer';

const sendMail = async (user) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const content = {
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: 'Verification Code',
      text: `Verify your email using this code: ${user.verificationCode}`,
    };

    const info = await transporter.sendMail(content);
    console.log('Email sent:', info.response);

    return 'Verification code has been sent to your email';
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification code');
  }
};

export default sendMail;
