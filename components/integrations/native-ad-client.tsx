"use client";

import { useEffect, useRef } from "react";

export function NativeAdClient({ scriptUrl, containerId }: { scriptUrl: string; containerId: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const timer = window.setTimeout(() => {
      if (!host.isConnected) return;
      const container = document.createElement("div");
    container.id = containerId;
    host.appendChild(container);

    const script = document.createElement("script");
    script.async = true;
    script.src = scriptUrl;
    script.dataset.cfasync = "false";
    script.dataset.gameWikiNativeAd = containerId;
    host.insertBefore(script, container);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      host.replaceChildren();
    };
  }, [containerId, scriptUrl]);

  return (
    <section className="ad-native-unit" data-native-ad-slot aria-label="Advertisement">
      <span className="ad-unit-label">Advertisement</span>
      <div ref={hostRef} className="ad-native-host" />
    </section>
  );
}
