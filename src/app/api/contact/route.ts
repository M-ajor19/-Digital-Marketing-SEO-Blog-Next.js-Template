import { NextRequest, NextResponse } from 'next/server';
import { ContactFormData, sendContactFormEmail, contactFormEmailTemplate } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Here you would integrate with your email service
    // For example, using Resend:
    /*
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'contact@yourdomain.com',
      to: 'hello@yourdomain.com',
      subject: `New Contact Form Submission from ${data.name}`,
      html: contactFormEmailTemplate(data),
    });

    // Send confirmation email to user
    await resend.emails.send({
      from: 'hello@yourdomain.com',
      to: data.email,
      subject: 'Thank you for contacting us',
      html: `
        <h2>Thank you for your message!</h2>
        <p>Hi ${data.name},</p>
        <p>We've received your message and will get back to you within 24 hours.</p>
        <p>Best regards,<br>The Digital Marketing Team</p>
      `,
    });
    */

    // For demo purposes, just log the data
    console.log('Contact form submission:', data);

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
