"use client";

import { useEffect, useState } from "react";

const WHATSAPP_NUMBER = "56989010309";
const ATTRIBUTION_KEY = "juegazo_contact_attribution";
const ATTRIBUTION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function cleanLabel(value, fallback = "") {
  return String(value || fallback)
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function detectAttribution() {
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source");
  const utmMedium = params.get("utm_medium");
  const utmCampaign = params.get("utm_campaign");
  const hasGoogleClick = Boolean(params.get("gclid") || params.get("gbraid") || params.get("wbraid"));
  const hasMetaClick = Boolean(params.get("fbclid"));
  const referrer = document.referrer.toLowerCase();

  let channel = "";
  if (hasGoogleClick || /google/.test(utmSource || "") && /cpc|ppc|paid/.test(utmMedium || "")) {
    channel = "GOOGLE-ADS";
  } else if (hasMetaClick || /facebook|instagram|meta/.test(utmSource || "")) {
    channel = "META-WEB";
  } else if (utmSource) {
    channel = cleanLabel(utmSource, "UTM");
  } else if (referrer.includes("google.")) {
    channel = "GOOGLE-ORGANICO";
  } else if (referrer.includes("facebook.") || referrer.includes("instagram.")) {
    channel = "REDES-ORGANICO";
  }

  if (channel) {
    const attribution = {
      channel,
      campaign: cleanLabel(utmCampaign),
      medium: cleanLabel(utmMedium),
      capturedAt: Date.now()
    };
    window.localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
    return attribution;
  }

  try {
    const stored = JSON.parse(window.localStorage.getItem(ATTRIBUTION_KEY) || "null");
    if (stored?.channel && Date.now() - stored.capturedAt < ATTRIBUTION_TTL_MS) return stored;
  } catch {
    window.localStorage.removeItem(ATTRIBUTION_KEY);
  }

  return { channel: "WEB-DIRECTO", campaign: "", medium: "", capturedAt: Date.now() };
}

export default function WhatsAppLink({ children, className = "", message, source = "web" }) {
  const [attribution, setAttribution] = useState(null);

  useEffect(() => {
    setAttribution(detectAttribution());
  }, []);

  const channel = attribution?.channel || "WEB-DIRECTO";
  const campaign = attribution?.campaign ? `/${attribution.campaign}` : "";
  const reference = `${channel}${campaign}`;
  const attributedMessage = `${message}\n\nRef: ${reference}`;
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(attributedMessage)}`;

  function trackClick() {
    const parameters = {
      event_category: "contacto",
      event_label: source,
      source,
      acquisition_channel: channel,
      acquisition_campaign: attribution?.campaign || "",
      acquisition_medium: attribution?.medium || "",
      contact_reference: reference
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
