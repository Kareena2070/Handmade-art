const phoneNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(
  /\D/g,
  "",
);

export function getWhatsAppUrl(message = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || "") {
  if (!phoneNumber) {
    return "#";
  }

  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${phoneNumber}${text}`;
}
