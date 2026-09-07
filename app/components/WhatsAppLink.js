"use client";

const WHATSAPP_NUMBER = "56989010309";

export default function WhatsAppLink({ children, className = "", message, source = "web" }) {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  function trackClick() {
    const parameters = {
      event_category: "contacto",
      event_label: source,
      source
    };
    window.gtag?.("event", "whatsapp_click", parameters);
    window.fbq?.("trackCustom", "WhatsAppClick", { source });
  }

  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={trackClick}
      data-contact-source={source}
    >
      {children}
    </a>
  );
}
