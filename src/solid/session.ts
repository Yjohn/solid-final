import { Session } from "@inrupt/solid-client-authn-browser";
import {
  CSS_ISSUER,
  SOLID_CLIENT_ID,
  REDIRECT_URL,
} from "./config";

export const session = new Session();

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
    oidcIssuer: "https://solidcommunity.net",
    redirectUrl: "https://solid-final.vercel.app/",
    clientId: "https://solid-final.vercel.app/clientid.json"
  });

}

export async function logout(): Promise<void> {
  await session.logout();
}