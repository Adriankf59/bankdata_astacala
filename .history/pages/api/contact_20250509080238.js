import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, subject, message } = req.body;
    
    // Configure nodemailer with Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Use Gmail as an example
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER || 'your-gmail@gmail.com', // Your Gmail address
        pass: process.env.EMAIL_PASSWORD || 'your-app-password' // Your Gmail password or App password
      }
    });
    
    try {
      // Send the email
      await transporter.sendMail({
        from: `"Astacala Website" <${process.env.EMAIL_USER || 'your-gmail@gmail.com'}>`,
        to: 'adriancuman@astacala.org',
        subject: `Contact Form: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Subject:</strong> ${subject}</p>
            <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-left: 4px solid #dc2626;">
              <h3 style="margin-top: 0;">Message:</h3>
              <p style="white-space: pre-line;">${message}</p>
            </div>
            <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">
              This message was sent from the Astacala website contact form.
            </p>
          </div>
        `
      });
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send email. Please try again later.',
        error: error.message
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}