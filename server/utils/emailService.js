const nodemailer = require('nodemailer');

// Create a transporter using SMTP credentials from .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendOrderConfirmationEmail = async (buyerEmail, sellerEmail, adDetails) => {
  const buyerMailOptions = {
    from: process.env.SMTP_FROM,
    to: buyerEmail,
    subject: 'Order Confirmation - UniResell',
    html: `
      <h2>Thank you for your purchase!</h2>
      <p>Your order for "${adDetails.title}" has been confirmed.</p>
      <p>Price: ₹${adDetails.price}</p>
      <p>Please contact the seller at ${sellerEmail} to arrange for pickup/delivery.</p>
    `
  };

  const sellerMailOptions = {
    from: process.env.SMTP_FROM,
    to: sellerEmail,
    subject: 'Your item has been sold - UniResell',
    html: `
      <h2>Congratulations! Your item has been sold!</h2>
      <p>Your listing "${adDetails.title}" has been purchased.</p>
      <p>Price: ₹${adDetails.price}</p>
      <p>The buyer's email is: ${buyerEmail}</p>
      <p>Please contact them to arrange for pickup/delivery.</p>
    `
  };

  try {
    await transporter.sendMail(buyerMailOptions);
    await transporter.sendMail(sellerMailOptions);
    return true;
  } catch (error) {
    console.error('Error sending emails:', error);
    return false;
  }
};

module.exports = { sendOrderConfirmationEmail }; 