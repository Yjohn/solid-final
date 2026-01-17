export const CSS_ISSUER = "https://solidcommunity.net";

// Client metadata MUST be reachable from inside Docker
export const SOLID_CLIENT_ID =
  "urn:solid:healthcare-app";

export const REDIRECT_URL = "https://solid-final.vercel.app/";
export const POST_LOGOUT_REDIRECT_URL = "https://solid-final.vercel.app/";

// Actors (example)
export const DOCTOR_WEBID =
  "https://doctor.solidcommunity.net/profile/card#me";

export const EMERGENCY_WEBID =
  "http://localhost:3000/emergency/profile/card#me";

export const PHARMACY_WEBID =
  "http://localhost:3000/pharmacy/profile/card#me";

export const NURSE_WEBID =
  "http://localhost:3000/nurse/profile/card#me";

export const PATIENTS = {
  patient1: {
    id: "patient",
    label: "Patient",
    webId: "https://patient.solidcommunity.net/profile/card#me",
    podBaseUrl: "https://patient.solidcommunity.net/",
  },
} as const;