"use client";

import { useEffect } from "react";

const ATTRIBUTION_KEY = "juegazo_contact_attribution";
const JOURNEY_KEY = "juegazo_reservation_journey";
const MAX_PAGES = 20;

function safeHost(value) {
  try {
    return new URL(value).hostname;
  } catch {
    return "";
  }
}

function campaignParameters() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    google_click: Boolean(params.get("gclid") || params.get("gbraid") || params.get("wbraid")),
    meta_click: Boolean(params.get("fbclid"))
  };
}

function readAttribution() {
  try {
    return JSON.parse(window.localStorage.getItem(ATTRIBUTION_KEY) || "null");
  } catch {
    return null;
  }
}

function readJourney() {
  try {
    return JSON.parse(window.sessionStorage.getItem(JOURNEY_KEY) || "null");
  } catch {
    return null;
  }
}

function recordPage(path) {
  const now = Date.now();
  const current = readJourney();
  const page = String(path || window.location.pathname).split("?")[0].slice(0, 180) || "/";
  const pages = Array.isArray(current?.pages) ? [...current.pages] : [];
  if (pages.at(-1)?.path !== page) pages.push({ path: page, visited_at: now });

  const journey = {
    started_at: current?.started_at || now,
    landing_page: current?.landing_page || page,
    referrer_host: current?.referrer_host ?? safeHost(document.referrer),
    campaign: current?.campaign || campaignParameters(),
    pages: pages.slice(-MAX_PAGES)
  };
  window.sessionStorage.setItem(JOURNEY_KEY, JSON.stringify(journey));
}

export function getReservationJourney() {
  if (typeof window === "undefined") return null;
  recordPage(window.location.pathname);
  const journey = readJourney();
  const attribution = readAttribution();
  return {
    ...journey,
    completed_at: Date.now(),
    duration_seconds: journey?.started_at ? Math.round((Date.now() - journey.started_at) / 1000) : null,
    channel: attribution?.channel || "WEB-DIRECTO",
    acquisition_campaign: attribution?.campaign || journey?.campaign?.utm_campaign || "",
    acquisition_medium: attribution?.medium || journey?.campaign?.utm_medium || ""
  };
}

export default function AttributionTracker() {
  useEffect(() => {
    recordPage(window.location.pathname);

    function trackPopState() {
      recordPage(window.location.pathname);
    }

    function trackInternalLink(event) {
      const anchor = event.target.closest?.("a[href]");
      if (!anchor) return;
      try {
        const target = new URL(anchor.href, window.location.href);
        if (target.origin === window.location.origin) recordPage(target.pathname);
      } catch {
        // Ignore malformed or non-navigation links.
      }
    }

    window.addEventListener("popstate", trackPopState);
    document.addEventListener("click", trackInternalLink, true);
    return () => {
      window.removeEventListener("popstate", trackPopState);
      document.removeEventListener("click", trackInternalLink, true);
    };
  }, []);

  return null;
}
