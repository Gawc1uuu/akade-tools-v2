import { Resend } from 'resend';

interface SendEmailOptions {
  to: string[];
  subject: string;
  react: React.ReactElement;
  from?: string;
}

export class EmailManager {
  private static instance: EmailManager;
  private resend: Resend;

  private constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not set');
      throw new Error('RESEND_API_KEY is not set');
    }
    this.resend = new Resend(apiKey);
  }

  public static getInstance(): EmailManager {
    if (!EmailManager.instance) {
      EmailManager.instance = new EmailManager();
    }
    return EmailManager.instance;
  }

  public async sendEmail(options: SendEmailOptions) {
    const { to, subject, react, from } = options;

    const fromAddress = from || 'Fleet Management <onboarding@resend.dev>';

    try {
      await this.resend.emails.send({
        from: fromAddress,
        to,
        subject,
        react,
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to send email');
    }
  }
}
