import { Session } from "@inrupt/solid-client-authn-browser";
// import {
//   CSS_ISSUER,
//   SOLID_CLIENT_ID,
//   REDIRECT_URL,
// } from "./config";

export const session = new Session();

// export async function initSessionFromRedirect(): Promise<void> {
//   await session.handleIncomingRedirect({
//     restorePreviousSession: true,
//   });
// }

export async function handleRedirect() {
  await session.handleIncomingRedirect(window.location.href);
  return session.info.isLoggedIn;
}

export function isLoggedIn(): boolean {
  return session.info.isLoggedIn === true;
}

export function getWebId(): string | undefined {
  return session.info.webId;
}

export async function login(): Promise<void> {
  const issuer = import.meta.env.VITE_SOLID_ISSUER as string;
  const redirectUrl = import.meta.env.VITE_REDIRECT_URL as string;
  const clientId = import.meta.env.VITE_CLIENT_ID as string;
  await session.login({
    oidcIssuer: issuer,
    redirectUrl,
    clientId,
  });

}

export async function logout(): Promise<void> {
  await session.logout();
}