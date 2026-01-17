export const CSS_ISSUER = "http://localhost:3000";

// Client metadata MUST be reachable from inside Docker
export const SOLID_CLIENT_ID =
  "urn:solid:healthcare-app";

export const REDIRECT_URL = "http://localhost:5173/";
export const POST_LOGOUT_REDIRECT_URL = "http://localhost:5173/";

// Actors (example)
export const DOCTOR_WEBID =
  "http://localhost:3000/doctor/profile/card#me";

export const EMERGENCY_WEBID =
  "http://localhost:3000/emergency/profile/card#me";

export const PHARMACY_WEBID =
  "http://localhost:3000/pharmacy/profile/card#me";

export const NURSE_WEBID =
  "http://localhost:3000/nurse/profile/card#me";

export const PATIENTS = {
  patient1: {
    id: "patient1",
    label: "Patient 1",
    webId: "http://localhost:3000/patient1/profile/card#me",
    podBaseUrl: "http://localhost:3000/patient1/",
  },
} as const;