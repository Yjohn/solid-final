// src/solid/config.ts

/* =======================
   ENV CONFIG (OIDC)
   ======================= */

export function requireEnv(name: string): string {
  const v = import.meta.env[name];
  if (!v || typeof v !== "string") throw new Error(`Missing required env variable: ${name}`);
  return v;
}

export const SOLID_ISSUER = "http://localhost:3000/";
export const CLIENT_ID = "http://localhost:5173/clientid.json";
export const REDIRECT_URL = "http://localhost:5173/";
export const POST_LOGOUT_URL = "http://localhost:5173/";


/* =======================
   ACTOR WEBIDs
   ======================= */

export const DOCTOR_WEBID =
  "http://localhost:3000/doctor/profile/card#me";

export const EMERGENCY_WEBID =
  "http://localhost:3000/emergency/profile/card#me";

export const PHARMACY_WEBID =
  "http://localhost:3000/pharmacy/profile/card#me";

export const NURSE_WEBID =
  "http://localhost:3000/nurse/profile/card#me";

/* =======================
   PATIENT REGISTRY
   ======================= */

export const PATIENTS = {
  patient1: {
    label: "Patient 1",
    webId: "http://localhost:3000/patient/profile/card#me",
    podBaseUrl: "http://localhost:3000/patient/",
  },
  patient2: {
    label: "Patient 2",
    webId: "http://localhost:3000/patient2/profile/card#me",
    podBaseUrl: "http://localhost:3000/patient2/",
  },
} as const;


// export const CSS_ISSUER = "http://localhost:3000";

// // Client metadata MUST be reachable from inside Docker
// export const SOLID_CLIENT_ID =
//   "http://host.docker.internal:5173/clientid.jsonld";

// export const REDIRECT_URL = "http://localhost:5173/redirect";
// export const POST_LOGOUT_REDIRECT_URL = "http://localhost:5173/redirect";

// // Actors (example)
// export const DOCTOR_WEBID =
//   "http://localhost:3000/doctor/profile/card#me";

// export const EMERGENCY_WEBID =
//   "http://localhost:3000/emergency/profile/card#me";

// export const PHARMACY_WEBID =
//   "http://localhost:3000/pharmacy/profile/card#me";

// export const NURSE_WEBID =
//   "http://localhost:3000/nurse/profile/card#me";

// export const PATIENTS = {
//   patient1: {
//     id: "patient",
//     label: "Patient",
//     webId: "http://localhost:3000/patient/profile/card#me",
//     podBaseUrl: "http://localhost:3000/patient/",
//   },
// } as const;