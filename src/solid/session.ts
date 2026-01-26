import {
  getDefaultSession,
  handleIncomingRedirect,
  login as solidLogin,
  logout as solidLogout,
} from "@inrupt/solid-client-authn-browser";
import { SOLID_ISSUER, CLIENT_ID, REDIRECT_URL, POST_LOGOUT_URL } from "./config";

export type AuthenticatedFetch = typeof getDefaultSession extends () => infer S
  ? S extends { fetch: infer F }
    ? F
    : never
  : never;

export const session = getDefaultSession();

export async function initSessionFromRedirect(): Promise<void> {
  // Inrupt docs show handleIncomingRedirect can be called directly in the browser flow. :contentReference[oaicite:3]{index=3}
  await handleIncomingRedirect();
}

export function isLoggedIn(): boolean {
  return session.info.isLoggedIn;
}

export function getWebId(): string | undefined {
  return session.info.webId;
}

export async function login(): Promise<void> {
  // IMPORTANT: use `clientId` (URL). Do NOT use `clientName` here.
  await solidLogin({
    oidcIssuer: SOLID_ISSUER,
    redirectUrl: REDIRECT_URL,
    clientId: CLIENT_ID,
  });
}

export async function logout(): Promise<void> {
  await session.logout();
  window.location.href = POST_LOGOUT_URL;
}


// // src/solid/session.ts
// import { Session } from "@inrupt/solid-client-authn-browser";
// import { SOLID_ISSUER, CLIENT_ID, REDIRECT_URL, POST_LOGOUT_URL } from "./config";

// export type AuthenticatedFetch = (
//   input: RequestInfo | URL,
//   init?: RequestInit
// ) => Promise<Response>;

// export const session = new Session();

// export async function initSessionFromRedirect(): Promise<void> {
//   // Works across versions. If your version supports restorePreviousSession, it will ignore unknown fields.
//   // If TypeScript complains, replace with: await session.handleIncomingRedirect(window.location.href);
//   await session.handleIncomingRedirect({ restorePreviousSession: true } as any);
// }

// export function isLoggedIn(): boolean {
//   return session.info.isLoggedIn;
// }

// export function getWebId(): string | undefined {
//   return session.info.webId;
// }

// export async function login(): Promise<void> {
//   await session.login({
//     oidcIssuer: SOLID_ISSUER,
//     redirectUrl: REDIRECT_URL,

//     // This forces STATIC URL Client ID, no random ID
//     clientId: CLIENT_ID,
//   });
// }

// export async function logout(): Promise<void> {
//   await session.logout();
//   window.location.href = POST_LOGOUT_URL;
// }








// import { Session } from "@inrupt/solid-client-authn-browser";
// // import {
// //   CSS_ISSUER,
// //   SOLID_CLIENT_ID,
// //   REDIRECT_URL,
// // } from "./config";

// export const session = new Session();

// export async function initSessionFromRedirect(): Promise<void> {
//   await session.handleIncomingRedirect({
//     restorePreviousSession: true,
//   });
// }

// export function isLoggedIn(): boolean {
//   return session.info.isLoggedIn === true;
// }

// export function getWebId(): string | undefined {
//   return session.info.webId;
// }

// export async function login(): Promise<void> {

//   const issuer = import.meta.env.VITE_SOLID_ISSUER as string;
//   const redirectUrl = import.meta.env.VITE_REDIRECT_URL as string;
//   const clientId = import.meta.env.VITE_CLIENT_ID as string;
//   await session.login({
//     oidcIssuer: issuer,
//     redirectUrl,
//     clientId,

//     // oidcIssuer: "https://solidcommunity.net",
//     // redirectUrl: "https://solid-final.vercel.app/",
//     // clientId: "https://solid-final.vercel.app/clientid.json"
//   });

// }

// export async function logout(): Promise<void> {
//   await session.logout();
// }