import { NextRequest, NextResponse } from 'next/server';
import { NewsletterData, addToMailChimpAudience, welcomeEmailTemplate } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const data: NewsletterData = await request.json();

    // Validate required fields
    if (!data.email) {
      return NextResponse.json(
        { error: 'Email is required' },
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

    // Here you would integrate with your newsletter service
    // For example, using MailChimp:
    /*
    try {
      await addToMailChimpAudience(data.email, data.firstName, data.lastName);
    } catch (error: any) {
      if (error.message.includes('already a list member')) {
        return NextResponse.json(
          { error: 'This email is already subscribed' },
          { status: 409 }
        );
      }
      throw error;
    }
    */

    // Or using ConvertKit, Klaviyo, etc.
    // For demo purposes, just log the data
    console.log('Newsletter subscription:', data);

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter' 
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}
