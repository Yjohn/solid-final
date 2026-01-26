// src/solid/healthData.ts
export type PatientKey = "patient1" | "patient2";

export type FullRecord = {
  patientName: string;
  dateOfBirth: string;
  bloodType: string;
  address: string;
  allergies: string;
  diagnoses: string;
  medications: string;
  notes: string;
};

export type PatientFile = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export function emptyFullRecord(): FullRecord {
  return {
    patientName: "",
    dateOfBirth: "",
    bloodType: "",
    address: "",
    allergies: "",
    diagnoses: "",
    medications: "",
    notes: "",
  };
}

export async function loadFullRecord(
  fetchFn: typeof fetch,
  podBaseUrl: string
): Promise<{ data: FullRecord | null; status: number }> {
  const url = `${podBaseUrl}health/full-record.json`;
  const res = await fetchFn(url, { headers: { Accept: "application/json" } });

  if (res.status === 404) return { data: null, status: 404 };
  if (res.status === 403) return { data: null, status: 403 };
  if (!res.ok) throw new Error(res.statusText);

  return { data: await res.json(), status: res.status };
}

export async function saveFullRecord(
  fetchFn: typeof fetch,
  podBaseUrl: string,
  record: FullRecord
): Promise<void> {
  const url = `${podBaseUrl}health/full-record.json`;
  const res = await fetchFn(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record, null, 2),
  });
  if (!res.ok) throw new Error(res.statusText);
}

/* ---- File management (simple version) ---- */

export async function loadPatientFiles(
  fetchFn: typeof fetch,
  podBaseUrl: string
): Promise<PatientFile[]> {
  const url = `${podBaseUrl}health/files.json`;
  const res = await fetchFn(url);
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function savePatientFile(
  fetchFn: typeof fetch,
  podBaseUrl: string,
  file: Omit<PatientFile, "id" | "createdAt" | "updatedAt">
): Promise<void> {
  const files = await loadPatientFiles(fetchFn, podBaseUrl);
  const now = new Date().toISOString();

  files.push({
    ...file,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  });

  const url = `${podBaseUrl}health/files.json`;
  const res = await fetchFn(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(files, null, 2),
  });
  if (!res.ok) throw new Error(res.statusText);
}

export async function deletePatientFile(
  fetchFn: typeof fetch,
  podBaseUrl: string,
  fileId: string
): Promise<void> {
  const files = await loadPatientFiles(fetchFn, podBaseUrl);
  const filtered = files.filter((f) => f.id !== fileId);

  const url = `${podBaseUrl}health/files.json`;
  const res = await fetchFn(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filtered, null, 2),
  });
  if (!res.ok) throw new Error(res.statusText);
}




// export type FullRecord = {
//   patientName: string;
//   dateOfBirth: string;
//   bloodType: string;
//   address: string;
//   allergies: string;
//   diagnoses: string;
//   medications: string;
//   notes: string;
//   files?: PatientFile[];
// };

// export interface PatientFile {
//   id: string;
//   title: string;
//   description: string;
//   content: string;
//   type: "lab" | "prescription" | "imaging" | "report" | "note";
//   createdAt: string;
//   updatedAt: string;
//   createdBy: string;
//   sharedWithDoctor: boolean;
//   sharedWithEmergency: boolean;
//   sharedWithNurse: boolean;
//   sharedWithPharmacy: boolean;
// }

// export type AuthenticatedFetch = (
//   input: RequestInfo,
//   init?: RequestInit
// ) => Promise<Response>;

// function fullRecordUrl(podBaseUrl: string): string {
//   return new URL("health/full-record.json", podBaseUrl).toString();
// }

// export async function loadFullRecord(
//   fetchFn: AuthenticatedFetch,
//   podBaseUrl: string
// ): Promise<{ data: FullRecord | null; status: number }> {
//   const url = fullRecordUrl(podBaseUrl);
//   const res = await fetchFn(url, {
//     headers: {
//       Accept: "application/json",
//     },
//   });

//   if (res.status === 404 || res.status === 403) {
//     return { data: null, status: res.status };
//   }

//   if (!res.ok) {
//     throw new Error(`Failed to load full record: ${res.status} ${res.statusText}`);
//   }

//   const json = await res.json();

//   const data: FullRecord = {
//     patientName: json.patientName ?? "",
//     dateOfBirth: json.dateOfBirth ?? "",
//     bloodType: json.bloodType ?? "",
//     address: json.address ?? "",
//     allergies: json.allergies ?? "",
//     diagnoses: json.diagnoses ?? "",
//     medications: json.medications ?? "",
//     notes: json.notes ?? "",
//     files: json.files || [],
//   };

//   return { data, status: res.status };
// }

// export async function saveFullRecord(
//   fetchFn: AuthenticatedFetch,
//   podBaseUrl: string,
//   data: FullRecord
// ): Promise<void> {
//   const url = fullRecordUrl(podBaseUrl);

//   const res = await fetchFn(url, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data, null, 2),
//   });

//   if (!res.ok) {
//     throw new Error(`Failed to save full record: ${res.status} ${res.statusText}`);
//   }
// }

// export function emptyFullRecord(patientName: string = ""): FullRecord {
//   return {
//     patientName,
//     dateOfBirth: "",
//     bloodType: "",
//     address: "",
//     allergies: "",
//     diagnoses: "",
//     medications: "",
//     notes: "",
//     files: [],
//   };
// }

// export async function loadPatientFiles(
//   fetchFn: AuthenticatedFetch,
//   podBaseUrl: string
// ): Promise<PatientFile[]> {
//   const { data } = await loadFullRecord(fetchFn, podBaseUrl);
//   return data?.files || [];
// }

// export async function savePatientFile(
//   fetchFn: AuthenticatedFetch,
//   podBaseUrl: string,
//   fileData: Omit<PatientFile, "id" | "createdAt" | "updatedAt">
// ): Promise<void> {
//   const { data: existingRecord } = await loadFullRecord(fetchFn, podBaseUrl);
  
//   if (!existingRecord) {
//     throw new Error("Full record not found or inaccessible");
//   }
  
//   const newFile: PatientFile = {
//     ...fileData,
//     id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   };
  
//   const updatedFiles = [newFile, ...(existingRecord.files || [])];
  
//   const updatedRecord: FullRecord = {
//     ...existingRecord,
//     files: updatedFiles,
//   };
  
//   await saveFullRecord(fetchFn, podBaseUrl, updatedRecord);
// }

// export async function deletePatientFile(
//   fetchFn: AuthenticatedFetch,
//   podBaseUrl: string,
//   fileId: string
// ): Promise<void> {
//   const { data: existingRecord } = await loadFullRecord(fetchFn, podBaseUrl);
  
//   if (!existingRecord) {
//     throw new Error("Full record not found or inaccessible");
//   }
  
//   const updatedFiles = (existingRecord.files || []).filter(file => file.id !== fileId);
  
//   if (updatedFiles.length === (existingRecord.files || []).length) {
//     throw new Error(`File with ID ${fileId} not found`);
//   }
  
//   const updatedRecord: FullRecord = {
//     ...existingRecord,
//     files: updatedFiles,
//   };
  
//   await saveFullRecord(fetchFn, podBaseUrl, updatedRecord);
// }

// export function createSamplePatientFile(
//   createdBy: string,
//   type: PatientFile["type"] = "lab"
// ): Omit<PatientFile, "id" | "createdAt" | "updatedAt"> {
//   const sampleData = {
//     "lab": {
//       title: "Blood Test Results",
//       description: "Complete blood count and metabolic panel",
//       content: "Hemoglobin: 14.2 g/dL\nWBC: 7.1 K/μL\nPlatelets: 250 K/μL\nGlucose: 95 mg/dL\nCreatinine: 0.9 mg/dL",
//     },
//     "prescription": {
//       title: "Antibiotic Prescription",
//       description: "Amoxicillin 500mg capsules",
//       content: "Amoxicillin 500mg\nTake one capsule every 8 hours for 10 days\nRefills: 0\nPrescribing Doctor: Dr. Smith",
//     },
//     "imaging": {
//       title: "Chest X-Ray Report",
//       description: "Routine chest radiograph",
//       content: "Findings: Lungs are clear, no infiltrates or masses\nHeart size normal\nBones and soft tissues unremarkable",
//     },
//     "report": {
//       title: "Annual Physical Exam",
//       description: "Yearly comprehensive health assessment",
//       content: "Patient in good health overall\nBlood pressure: 120/80\nWeight stable\nRecommended: Continue exercise regimen",
//     },
//     "note": {
//       title: "Follow-up Consultation",
//       description: "Post-operative checkup",
//       content: "Patient recovering well from procedure\nIncision site healing normally\nPain well controlled with medication",
//     }
//   };

//   const sample = sampleData[type];
  
//   return {
//     title: sample.title,
//     description: sample.description,
//     content: sample.content,
//     type,
//     createdBy,
//     sharedWithDoctor: true,
//     sharedWithEmergency: type !== "note",
//     sharedWithNurse: true,
//     sharedWithPharmacy: type === "prescription",
//   };
// }