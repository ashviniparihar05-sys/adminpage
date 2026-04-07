//My-app-admin-dashboard-22\frontend\src\lib\gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Event, AIAnalysis } from '../types';

const API_KEY = process.env.GEMINI_API_KEY || '';

// Sleep helper
const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function analyzeEventWithGemini(event: Partial<Event>): Promise<AIAnalysis> {
  if (!API_KEY) {
    return getFallback('API key missing. Set GEMINI_API_KEY in .env file.');
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `You are a strict AI content moderation system for EventHub, an event listing platform in India. Your job is to analyze event submissions and detect risks like scams, fraud, unsafe content, misleading information, illegal activity, or suspicious patterns.

ANALYZE THIS EVENT:
Title: "${event.title}"
Host: "${event.host}"
Category: "${event.category}"
Description: "${event.description}"
Ticket Price: "${event.ticketPrice}"
Location: "${event.location}"
Event Date: "${event.eventDate}"
Max Capacity: ${event.capacity}

SCORING RULES - Be strict and realistic:

riskScore (0-100):
- 0-20: Clean event (tech summit, yoga, food festival, community events)
- 21-45: Minor concerns (vague description, unverified host, unusual pricing)
- 46-70: Moderate risk (non-refundable tickets, entry details hidden, vague location)
- 71-85: High risk (suspicious financial claims, undisclosed activities, privacy violations)
- 86-100: Critical (investment scams, "guaranteed returns", illegal activities, drug references)

semanticIntegrity (0-100): Does the description make logical sense? Are claims consistent?
hostLegitimacy (0-100): How trustworthy does the host appear based on name and context?
engagementPattern (0-100): Does the event structure look genuine vs engineered to extract money?

RED FLAGS to detect:
- "guaranteed returns", "double your money", "earn within days" = CRITICAL SCAM
- "location revealed after payment", "details disclosed on arrival" = HIGH RISK
- "special substances", drug/alcohol references = HIGH RISK
- Non-refundable + no details given = MEDIUM-HIGH RISK
- "secret", "underground", "selected members only" = HIGH RISK
- Unrealistic financial promises = CRITICAL
- Suspicious links (Telegram, WhatsApp for payments) = HIGH RISK
- Free community events, registered organizations, clear descriptions = LOW RISK

Respond with ONLY valid JSON, no markdown, no code block, no explanation:
{
  "riskScore": <integer 0-100>,
  "riskLevel": "<low|medium|high|critical>",
  "semanticIntegrity": <integer 0-100>,
  "hostLegitimacy": <integer 0-100>,
  "engagementPattern": <integer 0-100>,
  "flags": [
    {
      "type": "<short flag name>",
      "severity": "<low|medium|high>",
      "description": "<specific issue found in this event>"
    }
  ],
  "summary": "<2-3 sentences explaining your risk assessment for this specific event>",
  "recommendation": "<specific actionable recommendation for the human moderator>"
}`;

  // Retry up to 3 times on 429
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      const cleaned = text
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/gi, '')
        .trim();

      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in response');

      const parsed = JSON.parse(jsonMatch[0]);
      if (typeof parsed.riskScore !== 'number') throw new Error('Invalid riskScore');

      return {
        riskScore: Math.min(100, Math.max(0, parsed.riskScore)),
        riskLevel: parsed.riskLevel || scoreToLevel(parsed.riskScore),
        semanticIntegrity: parsed.semanticIntegrity ?? 50,
        hostLegitimacy: parsed.hostLegitimacy ?? 50,
        engagementPattern: parsed.engagementPattern ?? 50,
        flags: Array.isArray(parsed.flags) ? parsed.flags : [],
        summary: parsed.summary || 'Analysis complete.',
        recommendation: parsed.recommendation || 'Review manually.',
        scannedAt: new Date().toISOString(),
        isLoading: false,
      };

    } catch (err: any) {
      const is429 = err?.message?.includes('429') || err?.status === 429;

      if (is429 && attempt < 3) {
        // Wait 20s on first retry, 40s on second
        const waitMs = attempt * 20000;
        console.warn(`Rate limit hit. Waiting ${waitMs / 1000}s before retry ${attempt + 1}/3...`);
        await sleep(waitMs);
        continue;
      }

      // On quota exhausted (daily limit), return smart local fallback
      if (is429) {
        console.error('Gemini daily quota exhausted. Using local analysis fallback.');
        return localFallbackAnalysis(event);
      }

      console.error('Gemini analysis failed:', err);
      return getFallback('AI analysis failed. Check console for details.');
    }
  }

  return getFallback('All retries failed.');
}

// ─── Local fallback analysis when API quota is exhausted ──────────────────────
// This runs keyword-based analysis on the client side
function localFallbackAnalysis(event: Partial<Event>): AIAnalysis {
  const text = `${event.title} ${event.description} ${event.host} ${event.category} ${event.location} ${event.ticketPrice}`.toLowerCase();

  const criticalKeywords = [
    'guaranteed returns', 'double your money', 'earn within days', 'zero risk',
    'invest and earn', 'quick profit', 'secret techniques', '10x returns',
    'financial freedom in days', 'earn ₹', 'earn rs', 'investment opportunity',
  ];
  const highKeywords = [
    'location will be revealed', 'details after payment', 'undisclosed',
    'underground', 'selected members', 'special substances', 'activities remain',
    'no refund', 'strict no-refund', 'telegram', 'whatsapp payment',
    'secret gathering', 'private access only',
  ];
  const mediumKeywords = [
    'vip only', 'exclusive access', 'limited access', 'non-refundable',
    'high profile', 'unknown', 'after booking confirmation', 'bring your own',
  ];

  const foundCritical = criticalKeywords.filter(k => text.includes(k));
  const foundHigh = highKeywords.filter(k => text.includes(k));
  const foundMedium = mediumKeywords.filter(k => text.includes(k));

  let riskScore = 5;
  const flags: AIAnalysis['flags'] = [];

  foundCritical.forEach(k => {
    riskScore += 25;
    flags.push({ type: 'Critical Pattern', severity: 'high', description: `Detected: "${k}"` });
  });
  foundHigh.forEach(k => {
    riskScore += 15;
    flags.push({ type: 'High Risk Pattern', severity: 'high', description: `Detected: "${k}"` });
  });
  foundMedium.forEach(k => {
    riskScore += 8;
    flags.push({ type: 'Suspicious Pattern', severity: 'medium', description: `Detected: "${k}"` });
  });

  riskScore = Math.min(98, riskScore);
  const level = scoreToLevel(riskScore);

  return {
    riskScore,
    riskLevel: level,
    semanticIntegrity: riskScore > 70 ? 20 : riskScore > 40 ? 55 : 85,
    hostLegitimacy: riskScore > 70 ? 15 : riskScore > 40 ? 50 : 80,
    engagementPattern: riskScore > 70 ? 10 : riskScore > 40 ? 45 : 82,
    flags,
    summary: riskScore > 70
      ? `⚠️ Local analysis detected ${flags.length} high-risk pattern(s). Gemini API quota exceeded — this is a keyword-based fallback result.`
      : riskScore > 40
      ? `⚠️ Local analysis found some concerns. Gemini API quota exceeded — keyword-based fallback result.`
      : `Local analysis found no major red flags. Gemini API quota exceeded — keyword-based fallback result.`,
    recommendation: riskScore > 70
      ? 'HIGH RISK detected by local analysis. Manually review before approving. Re-analyze with Gemini when quota resets.'
      : 'No critical issues detected locally. Re-analyze with Gemini when API quota resets for full AI review.',
    scannedAt: new Date().toISOString(),
    isLoading: false,
  };
}

function scoreToLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
  if (score >= 86) return 'critical';
  if (score >= 70) return 'high';
  if (score >= 45) return 'medium';
  return 'low';
}

function getFallback(reason: string): AIAnalysis {
  return {
    riskScore: 0,
    riskLevel: 'low',
    semanticIntegrity: 0,
    hostLegitimacy: 0,
    engagementPattern: 0,
    flags: [{ type: 'Analysis Failed', severity: 'low', description: reason }],
    summary: reason,
    recommendation: 'Please review this event manually.',
    scannedAt: new Date().toISOString(),
    isLoading: false,
  };
}

export function getRiskColor(score: number): string {
  if (score >= 80) return 'text-tertiary';
  if (score >= 50) return 'text-amber-600';
  return 'text-secondary';
}

export function getRiskBgColor(score: number): string {
  if (score >= 80) return 'bg-tertiary-container/10';
  if (score >= 50) return 'bg-amber-50';
  return 'bg-secondary-container/10';
}

export function getRiskBarColor(score: number): string {
  if (score >= 80) return 'bg-tertiary';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-secondary';
}

export function getRiskLabel(level: string): string {
  const labels: Record<string, string> = {
    low: 'LOW RISK',
    medium: 'MEDIUM RISK',
    high: 'HIGH RISK',
    critical: 'CRITICAL',
  };
  return labels[level] || 'UNKNOWN';
}