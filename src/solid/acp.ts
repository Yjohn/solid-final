// src/solid/acp.ts
import type { AuthenticatedFetch } from "./session";
import { SOLID_ISSUER, CLIENT_ID } from "./config";

type AccessOptions = {
  resourceUrl: string;
  patientWebId: string;

  doctorWebId: string;
  emergencyWebId: string;
  pharmacyWebId: string;
  nurseWebId: string;

  doctorCanReadWrite: boolean;
  emergencyCanRead: boolean;
  pharmacyCanRead: boolean;
  nurseCanReadWrite: boolean;

  restrictToClientAndIssuer?: boolean;
};

function matcherBlock(agentWebId: string, restrict: boolean): string {
  if (!restrict) {
    return `
    acp:anyOf [
      a acp:Matcher;
      acp:agent <${agentWebId}>;
    ];`.trim();
  }

  const issuer = SOLID_ISSUER.endsWith("/") ? SOLID_ISSUER : SOLID_ISSUER + "/";

  return `
    acp:anyOf [
      a acp:Matcher;
      acp:agent <${agentWebId}>;
      acp:client <${CLIENT_ID}>;
      acp:issuer <${issuer}>;
    ];`.trim();
}

function buildAcrTurtle(opts: AccessOptions): string {
  const {
    resourceUrl,
    patientWebId,
    doctorWebId,
    emergencyWebId,
    pharmacyWebId,
    nurseWebId,
    doctorCanReadWrite,
    emergencyCanRead,
    pharmacyCanRead,
    nurseCanReadWrite,
    restrictToClientAndIssuer = false,
  } = opts;

  const accessControls: string[] = ["<#ownerAccess>"];
  if (doctorCanReadWrite) accessControls.push("<#doctorAccess>");
  if (emergencyCanRead) accessControls.push("<#emergencyAccess>");
  if (pharmacyCanRead) accessControls.push("<#pharmacyAccess>");
  if (nurseCanReadWrite) accessControls.push("<#nurseAccess>");

  return `
@prefix acp: <http://www.w3.org/ns/solid/acp#>.
@prefix acl: <http://www.w3.org/ns/auth/acl#>.

<#root>
  a acp:AccessControlResource;
  acp:resource <${resourceUrl}>;
  acp:accessControl ${accessControls.join(", ")} .

<#ownerAccess>
  a acp:AccessControl;
  acp:apply [
    a acp:Policy;
    acp:allow acl:Read, acl:Write, acl:Append, acl:Control;
${matcherBlock(patientWebId, restrictToClientAndIssuer)}
  ] .

${
  doctorCanReadWrite
    ? `
<#doctorAccess>
  a acp:AccessControl;
  acp:apply [
    a acp:Policy;
    acp:allow acl:Read, acl:Write;
${matcherBlock(doctorWebId, restrictToClientAndIssuer)}
  ] .
`
    : ""
}

${
  emergencyCanRead
    ? `
<#emergencyAccess>
  a acp:AccessControl;
  acp:apply [
    a acp:Policy;
    acp:allow acl:Read;
${matcherBlock(emergencyWebId, restrictToClientAndIssuer)}
  ] .
`
    : ""
}

${
  pharmacyCanRead
    ? `
<#pharmacyAccess>
  a acp:AccessControl;
  acp:apply [
    a acp:Policy;
    acp:allow acl:Read;
${matcherBlock(pharmacyWebId, restrictToClientAndIssuer)}
  ] .
`
    : ""
}

${
  nurseCanReadWrite
    ? `
<#nurseAccess>
  a acp:AccessControl;
  acp:apply [
    a acp:Policy;
    acp:allow acl:Read, acl:Write;
${matcherBlock(nurseWebId, restrictToClientAndIssuer)}
  ] .
`
    : ""
}
`.trim();
}

function acrUrlForResource(resourceUrl: string): string {
  return `${resourceUrl}.acr`;
}

export async function applyAcpForResource(
  fetchFn: AuthenticatedFetch,
  options: AccessOptions
): Promise<void> {
  const acrUrl = acrUrlForResource(options.resourceUrl);
  const turtle = buildAcrTurtle(options);

  const res = await fetchFn(acrUrl, {
    method: "PUT",
    headers: { "Content-Type": "text/turtle" },
    body: turtle,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to update ACR: ${res.status} ${res.statusText}\n${text}`);
  }
}

export const applyAccessForFullRecord = applyAcpForResource;



// import type { AuthenticatedFetch } from "./healthData";

// type AccessOptions = {
//   resourceUrl: string;
//   patientWebId: string;
//   doctorWebId: string;
//   emergencyWebId: string;
//   doctorCanReadWrite: boolean;
//   emergencyCanRead: boolean;
// };

// /**
//  * Build an ACP Access Control Resource in Turtle for a single resource.
//  *
//  * Notes:
//  * - acp:accessControl takes a comma-separated list of access control nodes
//  * - acp:allow uses acl:Read/Write/Append/Control modes (NOT acp:Read etc)
//  */
// function buildAcrTurtle(opts: AccessOptions): string {
//   const {
//     resourceUrl,
//     patientWebId,
//     doctorWebId,
//     emergencyWebId,
//     doctorCanReadWrite,
//     emergencyCanRead,
//   } = opts;

//   // Correct Turtle object list for acp:accessControl
//   const accessControls: string[] = ["<#ownerAccess>"];
//   if (doctorCanReadWrite) accessControls.push("<#doctorAccess>");
//   if (emergencyCanRead) accessControls.push("<#emergencyAccess>");
//   const accessControlList = accessControls.join(", ");

//   return `
// @prefix acp: <http://www.w3.org/ns/solid/acp#>.
// @prefix acl: <http://www.w3.org/ns/auth/acl#>.

// acp:anyOf [
//   a acp:Matcher;
//   acp:agent <PATIENT_WEBID>;
//   acp:client <http://host.docker.internal:5173/clientid.jsonld>;
//   acp:issuer <http://localhost:3000/>;
// ];

// <#root>
//   a acp:AccessControlResource;
//   acp:resource <${resourceUrl}>;
//   acp:accessControl ${accessControlList} .

// <#ownerAccess>
//   a acp:AccessControl;
//   acp:apply [
//     a acp:Policy;
//     acp:allow acl:Read, acl:Write, acl:Append, acl:Control;
//     acp:anyOf [
//       a acp:Matcher;
//       acp:agent <${patientWebId}>;
//     ];
//   ] .
// ${
//   doctorCanReadWrite
//     ? `
// <#doctorAccess>
//   a acp:AccessControl;
//   acp:apply [
//     a acp:Policy;
//     acp:allow acl:Read, acl:Write;
//     acp:anyOf [
//       a acp:Matcher;
//       acp:agent <${doctorWebId}>;
//     ];
//   ] .
// `
//     : ""
// }
// ${
//   emergencyCanRead
//     ? `
// <#emergencyAccess>
//   a acp:AccessControl;
//   acp:apply [
//     a acp:Policy;
//     acp:allow acl:Read;
//     acp:anyOf [
//       a acp:Matcher;
//       acp:agent <${emergencyWebId}>;
//     ];
//   ] .
// `
//     : ""
// }
// `.trim();
// }

// /**
//  * In CSS with acr.json, the ACR for <resource> is at <resource>.acr
//  * e.g. /health/full-record.json.acr
//  */
// function acrUrlForResource(resourceUrl: string): string {
//   return resourceUrl + ".acr";
// }

// /**
//  * Create or update the ACR for a patient's full record.
//  */
// export async function applyAccessForFullRecord(
//   fetchFn: AuthenticatedFetch,
//   options: AccessOptions
// ): Promise<void> {
//   const acrUrl = acrUrlForResource(options.resourceUrl);
//   const turtle = buildAcrTurtle(options);

//   const res = await fetchFn(acrUrl, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "text/turtle",
//     },
//     body: turtle,
//   });

//   if (!res.ok) {
//     const text = await res.text().catch(() => "");
//     throw new Error(
//       `Failed to update ACR: ${res.status} ${res.statusText}\n${text}`
//     );
//   }
// }
// // Add this function to your existing acp.ts file
// export async function checkDoctorAccess(
//   fetch: typeof window.fetch,
//   podBaseUrl: string,
//   doctorWebId: string
// ): Promise<boolean> {
//   try {
//     const acrUrl = new URL(".acr", new URL("health/full-record.json", podBaseUrl)).toString();
    
//     // Try to fetch the ACR document
//     const response = await fetch(acrUrl, {
//       headers: { "Accept": "text/turtle" },
//     });

//     if (!response.ok) {
//       // If ACR doesn't exist, doctor doesn't have access
//       return false;
//     }

//     const turtle = await response.text();
    
//     // Check if the doctor's WebID appears in the ACR with write access
//     // This is a simplified check - in a real app you'd parse the Turtle properly
//     const hasWriteAccess = turtle.includes(doctorWebId) && 
//       (turtle.includes("acl:Write") || turtle.includes("acl:Read") || turtle.includes("acl:Control"));
    
//     return hasWriteAccess;
//   } catch (error) {
//     console.error("Error checking doctor access:", error);
//     return false;
//   }
// }