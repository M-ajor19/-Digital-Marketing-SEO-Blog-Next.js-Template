// Email service utilities for form submissions and newsletters

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  service?: string;
  message: string;
}

export interface NewsletterData {
  email: string;
  firstName?: string;
  lastName?: string;
  source?: string;
}

// Resend.com integration (recommended for Next.js)
export async function sendContactFormEmail(data: ContactFormData) {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending contact form:', error);
    throw error;
  }
}

// Newsletter subscription
export async function subscribeToNewsletter(data: NewsletterData) {
  try {
    const response = await fetch('/api/newsletter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to subscribe to newsletter');
    }

    return await response.json();
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    throw error;
  }
}

// Email templates
export const contactFormEmailTemplate = (data: ContactFormData) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Contact Form Submission</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #555; }
    .value { margin-top: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Contact Form Submission</h2>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Name:</div>
        <div class="value">${data.name}</div>
      </div>
      <div class="field">
        <div class="label">Email:</div>
        <div class="value">${data.email}</div>
      </div>
      ${data.company ? `
      <div class="field">
        <div class="label">Company:</div>
        <div class="value">${data.company}</div>
      </div>
      ` : ''}
      ${data.phone ? `
      <div class="field">
        <div class="label">Phone:</div>
        <div class="value">${data.phone}</div>
      </div>
      ` : ''}
      ${data.service ? `
      <div class="field">
        <div class="label">Service Interested In:</div>
        <div class="value">${data.service}</div>
      </div>
      ` : ''}
      <div class="field">
        <div class="label">Message:</div>
        <div class="value">${data.message}</div>
      </div>
    </div>
  </div>
</body>
</html>
`;

export const welcomeEmailTemplate = (email: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to Our Newsletter</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; background: white; }
    .footer { background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; }
    .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Our Newsletter!</h1>
      <p>Thank you for subscribing to our digital marketing insights</p>
    </div>
    <div class="content">
      <h2>What's Next?</h2>
      <p>You'll receive:</p>
      <ul>
        <li>Weekly SEO tips and strategies</li>
        <li>Content marketing best practices</li>
        <li>Industry news and trends</li>
        <li>Exclusive resources and tools</li>
      </ul>
      
      <p>As a welcome gift, download our free guide:</p>
      <a href="https://yourdomain.com/free-guide" class="button">Download Free SEO Guide</a>
      
      <p>Best regards,<br>The Digital Marketing Team</p>
    </div>
    <div class="footer">
      <p>You're receiving this because you subscribed to our newsletter.</p>
      <p>If you no longer wish to receive these emails, you can <a href="#">unsubscribe here</a>.</p>
    </div>
  </div>
</body>
</html>
`;

// MailChimp integration helper
export async function addToMailChimpAudience(email: string, firstName?: string, lastName?: string) {
  const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
  const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
  const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;

  if (!MAILCHIMP_API_KEY || !MAILCHIMP_AUDIENCE_ID || !MAILCHIMP_SERVER_PREFIX) {
    throw new Error('MailChimp configuration missing');
  }

  const url = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`;

  const data = {
    email_address: email,
    status: 'subscribed',
    merge_fields: {
      FNAME: firstName || '',
      LNAME: lastName || '',
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to subscribe to MailChimp');
  }

  return await response.json();
}
