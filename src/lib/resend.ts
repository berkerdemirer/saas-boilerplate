import { appConfig } from '@/app-config';
import { Resend } from 'resend';
import { ReactNode } from 'react';

export async function sendEmail({
  to,
  subject,
  template,
}: {
  to: string;
  subject: string;
  template: ReactNode;
}) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      to: to,
      from: appConfig.email.from,
      subject: subject,
      react: template,
    });

    if (error) {
      console.error('error', error);
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
