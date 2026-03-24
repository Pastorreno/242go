// Client-side storage for Vercel deployment
// Stores assessment results in memory (session) and optionally Google Sheets

export interface AssessmentRecord {
  id: number;
  name: string;
  email: string;
  churchName: string;
  discProfile: string;
  tier: number;
  tierName: string;
  whoScore: number;
  whereScore: number;
  carryScore: number;
  matureScore: number;
  whyScore: number;
  compositeScore: number;
  riskLevel: string;
  aiProfile?: string;
  submittedAt: string;
}

// In-memory store (persists for the browser session)
let store: AssessmentRecord[] = [];
let nextId = 1;

export function saveAssessment(data: Omit<AssessmentRecord, "id">): AssessmentRecord {
  const record = { ...data, id: nextId++ };
  store.unshift(record); // newest first
  return record;
}

export function getAssessments(): AssessmentRecord[] {
  return store;
}

export function updateAiProfile(id: number, aiProfile: string) {
  const record = store.find(r => r.id === id);
  if (record) record.aiProfile = aiProfile;
}

// Google Sheets webhook (optional — paste your Apps Script URL in the dashboard)
export async function syncToSheets(record: AssessmentRecord, webhookUrl: string) {
  try {
    await fetch(webhookUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
  } catch {
    // Silent fail — Sheets sync is optional
  }
}
