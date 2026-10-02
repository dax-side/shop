import "server-only";

type Message = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export function mailgunConfigured() {
  return Boolean(process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN && process.env.MAILGUN_FROM);
}

// Sends through the Mailgun HTTP API. Use https://api.eu.mailgun.net for EU-region domains.
export async function sendEmail(message: Message) {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const from = process.env.MAILGUN_FROM;
  const baseUrl = process.env.MAILGUN_API_URL || "https://api.mailgun.net";

  if (!apiKey || !domain || !from) {
    throw new Error("Mailgun is not configured. Set MAILGUN_API_KEY, MAILGUN_DOMAIN and MAILGUN_FROM.");
  }

  const body = new URLSearchParams({
    from,
    to: message.to,
    subject: message.subject,
    html: message.html,
    text: message.text,
  });
  if (message.replyTo) body.set("h:Reply-To", message.replyTo);

  const response = await fetch(`${baseUrl}/v3/${encodeURIComponent(domain)}/messages`, {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString("base64")}` },
    body,
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Mailgun responded ${response.status}: ${await response.text()}`);
  }
}
