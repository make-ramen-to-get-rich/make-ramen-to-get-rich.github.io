"use client";

import { useEffect, useRef, useState } from "react";

// Verbatim Adsterra GET CODE values for this specific site.
// Only the code for the current breakpoint is executed, never both.
const DESKTOP = {
  size: { width: 728, height: 90 },
  src: "https://bauval.org/22/b7dfb979ec2b1d85abf9f6055967d9ce",
  options: `  atOptions = {
    'key' : 'b7dfb979ec2b1d85abf9f6055967d9ce',
    'format' : 'iframe',
    'height' : 90,
    'width' : 728,
    'params' : {}
  };`,
};
const MOBILE = {
  size: { width: 320, height: 50 },
  src: "https://bauval.org/22/456192166e31690e3ec0221f8b61af9e",
  options: `  atOptions = {
    'key' : '456192166e31690e3ec0221f8b61af9e',
    'format' : 'iframe',
    'height' : 50,
    'width' : 320,
    'params' : {}
  };`,
};

type Format = "mobile" | "desktop";

export function ResponsiveBannerAd() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [format, setFormat] = useState<Format | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const update = () => setFormat(query.matches ? "desktop" : "mobile");
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !format) return;
    const code = format === "desktop" ? DESKTOP : MOBILE;
    // Delay one tick so React StrictMode's dev-only effect replay cannot
    // request a script for a discarded mount.
    const timer = window.setTimeout(() => {
      if (!host.isConnected) return;
      host.replaceChildren();
      // Execute the supplied inline atOptions snippet unchanged. The next
      // external script reads it in the same DOM order as the GET CODE.
      const options = document.createElement("script");
      options.textContent = code.options;
      const external = document.createElement("script");
      external.async = false;
      external.src = code.src;
      external.dataset.ramenAdBanner = format;
      host.appendChild(options);
      host.appendChild(external);
    }, 0);
    return () => {
      window.clearTimeout(timer);
      host.replaceChildren();
    };
  }, [format]);

  return (
    <section className="site-container ad-banner-section" aria-label="Advertisement" data-responsive-ad data-device={format ?? "pending"}>
      <span className="ad-unit-label">Advertisement</span>
      <div className={format === "desktop" ? "ad-banner-frame ad-banner-desktop" : "ad-banner-frame ad-banner-mobile"}>
        <div ref={hostRef} className="ad-banner-host" />
      </div>
    </section>
  );
}
