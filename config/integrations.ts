import type { IntegrationConfig } from "./types";
import generatedIntegrationsRaw from "../content/generated/integrations.json";

type GeneratedIntegrations = {
  gaMeasurementId?: string | null;
  bingSiteVerification?: string | null;
};

const generatedIntegrations = generatedIntegrationsRaw as GeneratedIntegrations;

const gaFromEnv = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "";
const gaFromGenerated = typeof generatedIntegrations.gaMeasurementId === "string"
  ? generatedIntegrations.gaMeasurementId.trim()
  : "";
const gaMeasurementId = gaFromEnv || gaFromGenerated || "";

const bingFromEnv = process.env.BING_SITE_VERIFICATION?.trim() || "";
const bingFromGenerated = typeof generatedIntegrations.bingSiteVerification === "string"
  ? generatedIntegrations.bingSiteVerification.trim()
  : "";
const bingVerification = bingFromEnv || bingFromGenerated || null;

export const integrations: IntegrationConfig = {
  analytics: /^G-[A-Z0-9]+$/i.test(gaMeasurementId)
    ? { provider: "google-analytics", measurementId: gaMeasurementId.toUpperCase() }
    : { provider: "none" },
  ads: {
    provider: "adsterra-native",
    scriptUrl: "https://bauval.org/21/c33762aef60dfa6d31c6c782d4de1fb1",
    containerId: "container-c33762aef60dfa6d31c6c782d4de1fb1",
  },
  verification: {
    bing: bingVerification,
  },
};
