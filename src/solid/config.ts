
// Your Community Solid Server issuer
export const CSS_ISSUER = "http://localhost:3000/";

// Map of patients in the system.
// Update webId and podBaseUrl to match your CSS pods.
export const PATIENTS = {
  patient1: {
    id: "patient1",
    label: "Patient 1",
    webId: "http://localhost:3000/patient/profile/card#me",
    podBaseUrl: "http://localhost:3000/patient/",
  },
  patient2: {
    id: "patient2",
    label: "Patient 2",
    webId: "http://localhost:3000/patient1/profile/card#me",
    podBaseUrl: "http://localhost:3000/patient1/",
  },
   patient3: {
    id: "patient3",
    label: "Patient 3",
    webId: "http://localhost:3000/patient2/profile/card#me",
    podBaseUrl: "http://localhost:3000/patient2/",
  }
} as const;
// export const DOCTOR_WEBID = {
//   doctor1: {
//     id: "doctor1",
//     label: "Patient 1",
//     webId: "http://localhost:3000/doctor1/profile/card#me",
//     podBaseUrl: "http://localhost:3000/doctor/",
//   },
//   doctor2: {
//     id: "doctor2",
//     label: "Patient 2",
//     webId: "http://localhost:3000/doctor2/profile/card#me",
//     podBaseUrl: "http://localhost:3000/pdoctor2/",
//   },
// } as const;

// Clinician and other actors - again update to match pods you create.
export const Patient_WEBID = "http://localhost:3000/Patient1/profile/card#me";
export const DOCTOR_WEBID = "http://localhost:3000/doctor1/profile/card#me";
export const EMERGENCY_WEBID = "http://emergency.localhost:3000/profile/card#me";
export const PHARMACY_WEBID = "http://pharmacy.localhost:3000/profile/card#me";
export const NURSE_WEBID = "http://nurse.localhost:3000/profile/card#me";