// //My-app-admin-dashboard-22\frontend\src\lib\openai.ts
// import OpenAI from "openai";
// import type { Event, AIAnalysis } from "../types";

// const client = new OpenAI({
//   apiKey: import.meta.env.VITE_OPENAI_API_KEY, // IMPORTANT
// });
// export const getRiskBarColor = (score: number) => {
//   if (score >= 70) return 'bg-red-500';
//   if (score >= 40) return 'bg-yellow-500';
//   return 'bg-green-500';
// };
// // Risk text color
// export const getRiskColor = (score: number) => {
//   if (score >= 70) return 'text-red-500';
//   if (score >= 40) return 'text-yellow-500';
//   return 'text-green-500';
// };

// // Risk label (Low / Medium / High)
// export const getRiskLabel = (level: string) => {
//   switch (level) {
//     case 'critical':
//       return 'CRITICAL';
//     case 'high':
//       return 'HIGH RISK';
//     case 'medium':
//       return 'MEDIUM';
//     case 'low':
//       return 'LOW';
//     default:
//       return 'UNKNOWN';
//   }
// };
// //export async function analyzeEventWithAI(event: Partial<Event>): Promise<AIAnalysis>
// export async function analyzeEventWithOpenAI(event: Partial<Event>): Promise<AIAnalysis> {
//   const prompt = `
// You are an AI moderation system. Analyze this event and return JSON.

// EVENT:
// Title: ${event.title}
// Host: ${event.host}
// Category: ${event.category}
// Description: ${event.description}
// Price: ${event.ticketPrice}
// Location: ${event.location}

// Return JSON:
// {
//  "riskScore": number,
//  "riskLevel": "low|medium|high|critical",
//  "semanticIntegrity": number,
//  "hostLegitimacy": number,
//  "engagementPattern": number,
//  "flags": [],
//  "summary": "",
//  "recommendation": ""
// }
// `;

//   try {
//     const res = await client.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.3,
//     });

//     const text = res.choices[0].message.content || "{}";
//     const cleaned = text.replace(/```json|```/g, "").trim();
//     const parsed = JSON.parse(cleaned);

//     return {
//       ...parsed,
//       scannedAt: new Date().toISOString(),
//       isLoading: false,
//     };
//   } catch (err) {
//     console.error(err);

//     return {
//       riskScore: 0,
//       riskLevel: "low",
//       semanticIntegrity: 100,
//       hostLegitimacy: 100,
//       engagementPattern: 100,
//       flags: [],
//       summary: "AI failed",
//       recommendation: "Manual review required",
//       scannedAt: new Date().toISOString(),
//       isLoading: false,
//     };
//   }
// }
// frontend/src/lib/openai.ts
import type { Event, AIAnalysis } from '../types';

export const getRiskBarColor = (score: number) => {
  if (score >= 70) return 'bg-red-500';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-green-500';
};

export const getRiskColor = (score: number) => {
  if (score >= 70) return 'text-red-500';
  if (score >= 40) return 'text-yellow-500';
  return 'text-green-500';
};

export const getRiskLabel = (level: string) => {
  switch (level) {
    case 'critical': return 'CRITICAL';
    case 'high':     return 'HIGH RISK';
    case 'medium':   return 'MEDIUM';
    case 'low':      return 'LOW';
    default:         return 'UNKNOWN';
  }
};

export async function analyzeEventWithOpenAI(event: Partial<Event>): Promise<AIAnalysis> {
  try {
    const res = await fetch('http://localhost:5006/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event }),
    });

  // lib/openai.ts mein analyzeEventWithOpenAI function ke try block ka return:

const data = await res.json();
  // ✅ YE ADD KARO — browser console mein dikhega
    console.log("🤖 AI Response:", data);
    console.log("🎯 Risk Score:", data.riskScore);
    
return {
  riskScore: data.riskScore ?? 0,
  riskLevel: data.riskLevel ?? 'low',
  semanticIntegrity: data.semanticIntegrity ?? 80,
  hostLegitimacy: data.hostLegitimacy ?? 80,
  engagementPattern: data.engagementPattern ?? 80,
  flags: Array.isArray(data.flags) ? data.flags : [],  // ✅ Always array
  summary: data.summary ?? 'No summary available',
  recommendation: data.recommendation ?? '',
  scannedAt: new Date().toISOString(),
  isLoading: false,
};
  } catch (err) {
    console.error(err);
    return {
      riskScore: 0,
      riskLevel: 'low',
      semanticIntegrity: 100,
      hostLegitimacy: 100,
      engagementPattern: 100,
      flags: [],
      summary: 'AI analysis failed — manual review required.',
      recommendation: 'Please review this event manually.',
      scannedAt: new Date().toISOString(),
      isLoading: false,
    };
  }
}