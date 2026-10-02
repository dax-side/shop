import "server-only";
import { formatNaira } from "../format";
import { nextSteps, PAYMENT_LABELS, type OrderWithItems } from "../orders";
import { site } from "../site";

const colors = { paper: "#f1efea", ink: "#171614", muted: "#5f5b54", line: "#d9d5cd" };
const fonts = {
  sans: "'Archivo', 'Helvetica Neue', Arial, sans-serif",
  display: "'Archivo', Impact, 'Arial Narrow', sans-serif",
  serif: "'Instrument Serif', Georgia, 'Times New Roman', serif",
  mono: "'JetBrains Mono', 'Courier New', monospace",
};

function escape(value: string | null | undefined) {
  return (value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const dateFormat = new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" });

function label(text: string) {
  return `<p style="margin:0 0 12px;font-family:${fonts.mono};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${colors.ink};">${text}</p>`;
}

export function orderConfirmationEmail(order: OrderWithItems, orderUrl: string) {
  const siteUrl = new URL(orderUrl).host;
  const subject = `Order confirmed: ${order.reference}`;
  const delivery = order.delivery === 0 ? "Free" : formatNaira(order.delivery);

  const items = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid ${colors.line};width:64px;">
          <div style="width:64px;height:64px;background:${escape(item.tone)};"></div>
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid ${colors.line};">
          <p style="margin:0;font-family:${fonts.sans};font-size:16px;font-weight:600;color:${colors.ink};">${escape(item.name)}</p>
          <p style="margin:4px 0 0;font-family:${fonts.mono};font-size:12px;color:${colors.muted};">No. ${escape(item.number)}${
            item.finish ? ` · ${escape(item.finish)}` : ""
          } · Qty ${item.quantity}</p>
        </td>
        <td align="right" style="padding:12px 0;border-bottom:1px solid ${colors.line};font-family:${fonts.mono};font-size:14px;color:${colors.ink};white-space:nowrap;">${formatNaira(item.lineTotal)}</td>
      </tr>`,
    )
    .join("");

  const address =
    order.method === "delivery"
      ? [`${order.firstName} ${order.lastName}`, order.street, `${order.area}, ${order.state}`, order.phone]
      : [`${order.firstName} ${order.lastName}`, order.phone];

  const steps = nextSteps(order.method)
    .map(
      (step, index) => `
      <tr>
        <td valign="top" style="padding:0 0 12px;width:48px;font-family:${fonts.mono};font-size:12px;color:${colors.ink};">${String(index + 1).padStart(2, "0")}</td>
        <td style="padding:0 0 12px;font-family:${fonts.sans};font-size:15px;line-height:1.5;color:${colors.ink};"><strong>${escape(step.title)}</strong> ${escape(step.body)}</td>
      </tr>`,
    )
    .join("");

  const html = `<!doctype html>
<html lang="en" style="background:${colors.paper};">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${escape(subject)}</title>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:${colors.paper};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colors.paper};">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
  <tr>
    <td style="background:${colors.ink};padding:12px 32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="font-family:${fonts.mono};font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${colors.paper};">Order ${escape(order.reference)}</td>
        <td align="right" style="font-family:${fonts.mono};font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${colors.paper};">${dateFormat.format(order.createdAt)}</td>
      </tr></table>
    </td>
  </tr>
  <tr>
    <td style="padding:32px 32px 40px;border-bottom:1px solid ${colors.ink};">
      <p style="margin:0 0 32px;font-family:${fonts.display};font-size:26px;font-weight:900;font-stretch:62%;color:${colors.ink};">OJA <span style="font-family:${fonts.mono};font-size:11px;font-weight:400;letter-spacing:2px;">SUPPLY CO.</span></p>
      <h1 style="margin:0;font-family:${fonts.display};font-size:48px;line-height:0.95;font-weight:900;font-stretch:62%;letter-spacing:-1px;text-transform:uppercase;color:${colors.ink};">Order<br>confirmed.</h1>
      <p style="margin:24px 0 0;font-family:${fonts.serif};font-style:italic;font-size:26px;line-height:1.25;color:${colors.ink};">Thanks, ${escape(order.firstName)}. We're packing it now.</p>
      <p style="margin:16px 0 0;font-family:${fonts.sans};font-size:16px;line-height:1.55;color:${colors.ink};">Here's what you ordered. We'll email you again ${
        order.method === "delivery" ? "with tracking once it leaves the shop." : "when it's ready to collect."
      }</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;"><tr>
        <td style="background:${colors.ink};border-radius:999px;">
          <a href="${escape(orderUrl)}" style="display:inline-block;padding:14px 28px;font-family:${fonts.sans};font-size:15px;color:${colors.paper};text-decoration:none;">View your order</a>
        </td>
      </tr></table>
    </td>
  </tr>
  <tr>
    <td style="padding:32px;border-bottom:1px solid ${colors.ink};">
      ${label("In your order")}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${items}</table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;border-bottom:1px solid ${colors.ink};">
        <tr><td style="padding:4px 0;font-family:${fonts.sans};font-size:15px;color:${colors.ink};">Subtotal</td><td align="right" style="font-family:${fonts.mono};font-size:14px;color:${colors.ink};">${formatNaira(order.subtotal)}</td></tr>
        <tr><td style="padding:4px 0;font-family:${fonts.sans};font-size:15px;color:${colors.ink};">${order.method === "delivery" ? "Delivery" : "Pickup"}</td><td align="right" style="font-family:${fonts.mono};font-size:14px;color:${colors.ink};">${delivery}</td></tr>
        <tr><td style="padding:8px 0 16px;font-family:${fonts.sans};font-size:17px;font-weight:700;color:${colors.ink};">Total paid</td><td align="right" style="padding:8px 0 16px;font-family:${fonts.mono};font-size:17px;font-weight:700;color:${colors.ink};">${formatNaira(order.total)}</td></tr>
      </table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;"><tr>
        <td valign="top" width="50%" style="padding-right:12px;">
          ${label(order.method === "delivery" ? "Delivering to" : "Collecting")}
          <p style="margin:0;font-family:${fonts.sans};font-size:15px;line-height:1.5;color:${colors.ink};">${address.map(escape).join("<br>")}</p>
        </td>
        <td valign="top" width="50%" style="padding-left:12px;">
          ${label("Paying with")}
          <p style="margin:0;font-family:${fonts.sans};font-size:15px;line-height:1.5;color:${colors.ink};">${PAYMENT_LABELS[order.paymentMethod]}<br>${
            order.method === "delivery" ? "Arrives in 1–2 days in Lagos" : "Usually ready the same day"
          }</p>
        </td>
      </tr></table>
    </td>
  </tr>
  <tr>
    <td style="padding:32px;">
      ${label("What happens next")}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${steps}</table>
    </td>
  </tr>
  <tr>
    <td style="background:${colors.ink};padding:32px;">
      <p style="margin:0;font-family:${fonts.serif};font-size:24px;line-height:1.3;color:${colors.paper};">Questions? Reply to this email${site.phone ? ` or call ${escape(site.phone)}` : ""}.</p>
      <p style="margin:16px 0 0;font-family:${fonts.sans};font-size:13px;line-height:1.6;color:#cfcac1;">${[site.name, site.storeAddress, site.city].filter(Boolean).map((part) => escape(part)).join(" · ")}<br>You're getting this because you placed an order at ${escape(siteUrl)}.</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  const text = [
    `ORDER CONFIRMED. ${order.reference}`,
    "",
    `Thanks, ${order.firstName}. We're packing it now.`,
    "",
    "In your order:",
    ...order.items.map(
      (item) =>
        `- ${item.name} (No. ${item.number}${item.finish ? `, ${item.finish}` : ""}) x${item.quantity}: ${formatNaira(item.lineTotal)}`,
    ),
    "",
    `Subtotal: ${formatNaira(order.subtotal)}`,
    `${order.method === "delivery" ? "Delivery" : "Pickup"}: ${delivery}`,
    `Total paid: ${formatNaira(order.total)}`,
    "",
    `${order.method === "delivery" ? "Delivering to" : "Collecting"}:`,
    ...address,
    "",
    `Paying with: ${PAYMENT_LABELS[order.paymentMethod]}`,
    "",
    `View your order: ${orderUrl}`,
    "",
    `Questions? Reply to this email${site.phone ? ` or call ${site.phone}` : ""}.`,
    [site.name, site.storeAddress, site.city].filter(Boolean).join(" · "),
  ].join("\n");

  return { subject, html, text };
}
