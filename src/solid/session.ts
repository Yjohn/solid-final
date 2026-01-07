import { Session } from "@inrupt/solid-client-authn-browser";
import { CSS_ISSUER } from "./config";

export const session = new Session();

/**
 * Call this once on app start to complete the OIDC redirect
 * and restore any previous session.
 */
export async function initSessionFromRedirect(): Promise<void> {
  await session.handleIncomingRedirect({
    restorePreviousSession: true,
  });
}

export function isLoggedIn(): boolean {
  return session.info.isLoggedIn === true;
}

export function getWebId(): string | undefined {
  return session.info.webId;
}

export async function login(): Promise<void> {
  await session.login({
    oidcIssuer: CSS_ISSUER,
    clientName: "CSS Healthcare ACP Demo",
    redirectUrl: window.location.origin,
  });
}

export async function logout(): Promise<void> {
  await session.logout();
}