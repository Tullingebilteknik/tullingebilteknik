"use client";

import { useEffect } from "react";

export function LandingPageTracker() {
  useEffect(() => {
    try {
      if (!sessionStorage.getItem("landing_page")) {
        sessionStorage.setItem("landing_page", window.location.pathname);
      }
    } catch {
      // sessionStorage unavailable (SSR, incognito restrictions, etc.)
    }
  }, []);

  return null;
}
