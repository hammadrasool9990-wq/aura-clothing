// Sends form data to Formspree (https://formspree.io), which emails it to
// the address your Formspree form is registered with — aurevon9990@gmail.com.
// Setup: see README → "Connect the contact form".

const CONTACT_ID = import.meta.env.VITE_FORMSPREE_CONTACT_ID as string | undefined;
const NEWSLETTER_ID = (import.meta.env.VITE_FORMSPREE_NEWSLETTER_ID as string | undefined) || CONTACT_ID;

export class FormNotConnectedError extends Error {}

async function send(formId: string | undefined, data: Record<string, string>) {
  if (!formId || formId.startsWith('YOUR_')) {
    throw new FormNotConnectedError('Form is not connected yet.');
  }
  const res = await fetch(`https://formspree.io/f/${formId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    let msg = 'Something went wrong. Please try again or email us directly.';
    try {
      const body = await res.json();
      if (body?.errors?.[0]?.message) msg = body.errors[0].message;
    } catch {
      /* keep default message */
    }
    throw new Error(msg);
  }
}

export interface ContactData {
  name: string;
  email: string;
  phone: string;
  topic: string;
  rating: string; // '' or '1'–'5'
  message: string;
  _gotcha: string;
}

export const sendContact = (data: ContactData) =>
  send(CONTACT_ID, {
    ...data,
    rating: data.rating ? `${data.rating} / 5` : 'not given',
    _replyto: data.email,
    _subject: `AURA-CLOTHING ${data.topic.toLowerCase()}: ${data.name}`,
  });

export const sendNewsletter = (email: string) =>
  send(NEWSLETTER_ID, { email, _subject: 'AURA-CLOTHING newsletter signup' });
