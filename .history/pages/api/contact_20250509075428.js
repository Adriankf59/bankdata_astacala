import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, subject, message } = req.body;
    
    // Configure nodemailer with your email service
    const transporter = nodemailer.createTransport({
      host: 'your-smtp-server.com', // Replace with your SMTP server (e.g., smtp.gmail.com)
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // Store this in .env.local
        pass: process.env.EMAIL_PASSWORD // Store this in .env.local
      }
    });
    
    try {
      // Send the email
      await transporter.sendMail({
        from: 'website@astacala.org', // Or use process.env.EMAIL_FROM
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
      res.status(500).json({ success: false, message: 'Failed to send email' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}