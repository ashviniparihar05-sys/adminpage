// // backend/services/image-analysis.service.js
// // GPT-4o Vision image analysis

// import { openai } from "../config/openai.js";
// import { GENERIC_IMAGE_DOMAINS } from "../utils/constants.js";

// export async function analyzeImageWithAI(imageUrl, context) {
//   // Case 1: No image URL
//   if (!imageUrl || !imageUrl.startsWith("http")) {
//     return {
//       checked: false,
//       reason: "No valid image URL provided",
//       flags: [
//         {
//           type: "Missing Image",
//           description:
//             "Event/service has no image uploaded. Original photos increase trust.",
//           severity: "medium",
//         },
//       ],
//       imageRiskScore: 30,
//       isRelevant: false,
//       isAppropriate: true,
//       isPlaceholder: true,
//     };
//   }

//   // Case 2: Known generic/stock/placeholder domain
//   const isGenericDomain = GENERIC_IMAGE_DOMAINS.some((domain) =>
//     imageUrl.includes(domain)
//   );
//   if (isGenericDomain) {
//     const domainFound = GENERIC_IMAGE_DOMAINS.find((d) => imageUrl.includes(d));
//     return {
//       checked: false,
//       reason: `Generic stock/placeholder image detected (${domainFound})`,
//       flags: [
//         {
//           type: "Generic Placeholder Image",
//           description: `Image is from a stock/placeholder service (${domainFound}). Real events should have original photos specific to the event.`,
//           severity: "low",
//         },
//       ],
//       imageRiskScore: 15,
//       isRelevant: false,
//       isAppropriate: true,
//       isPlaceholder: true,
//     };
//   }

//   // Case 3: GPT-4o Vision analysis
//   try {
//     console.log(`  🖼️  Analyzing image: ${imageUrl.slice(0, 60)}...`);

//     const response = await openai.chat.completions.create({
//       model: "gpt-4o",
//       max_tokens: 500,
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a strict image moderation AI for an event platform. Analyze images objectively and return ONLY valid JSON. No preamble, no explanation — just JSON.",
//         },
//         {
//           role: "user",
//           content: [
//             {
//               type: "text",
//               text: `Analyze this image for event platform moderation.

// EVENT CONTEXT:
// Title: ${context.title || "N/A"}
// Category: ${context.category || "N/A"}
// Description: ${(context.description || "N/A").slice(0, 200)}

// Return ONLY this JSON (no backticks, no extra text):
// {
//   "isRelevant": <true if image matches event title/category, false if completely unrelated>,
//   "isAppropriate": <true if no NSFW/violent/drug/gore/explicit content, false otherwise>,
//   "isPlaceholder": <true if generic stock photo not specific to this event, false if original/specific>,
//   "imageRiskScore": <0-100, where 0=perfectly safe+relevant, 100=very risky>,
//   "relevanceNote": "<one sentence why relevant or not>",
//   "appropriatenessNote": "<describe any content concern, or write 'clean' if none>",
//   "placeholderNote": "<why it looks generic or original>",
//   "suspiciousText": "<any overlaid text like prices, phone numbers, links? describe exactly or write 'none'>",
//   "dominantContent": "<what is primarily shown in the image in 5-7 words>",
//   "flags": [{"type": "<short flag name>", "description": "<specific detail about this image>", "severity": "<low|medium|high>"}]
// }

// Scoring guide:
// 0-20   = Clean, relevant, original image
// 21-40  = Generic/stock but harmless
// 41-60  = Somewhat irrelevant or mildly concerning
// 61-80  = Clearly wrong image or moderately concerning content
// 81-100 = NSFW, violent, misleading, or highly suspicious`,
//             },
//             {
//               type: "image_url",
//               image_url: {
//                 url: imageUrl,
//                 detail: "low",
//               },
//             },
//           ],
//         },
//       ],
//     });

//     const raw = response.choices[0].message.content || "{}";
//     const cleaned = raw.replace(/```json|```/g, "").trim();
//     const parsed = JSON.parse(cleaned);

//     const imageRiskScore = Math.min(100, Math.max(0, parsed.imageRiskScore ?? 20));

//     console.log(
//       `  🖼️  Image result: score=${imageRiskScore} | relevant=${parsed.isRelevant} | appropriate=${parsed.isAppropriate} | placeholder=${parsed.isPlaceholder}`
//     );
//     if (parsed.dominantContent) {
//       console.log(`  🖼️  Dominant content: "${parsed.dominantContent}"`);
//     }

//     return {
//       checked: true,
//       imageRiskScore,
//       isRelevant: parsed.isRelevant ?? true,
//       isAppropriate: parsed.isAppropriate ?? true,
//       isPlaceholder: parsed.isPlaceholder ?? false,
//       relevanceNote: parsed.relevanceNote ?? "",
//       appropriatenessNote: parsed.appropriatenessNote ?? "clean",
//       placeholderNote: parsed.placeholderNote ?? "",
//       suspiciousText: parsed.suspiciousText ?? "none",
//       dominantContent: parsed.dominantContent ?? "",
//       flags: Array.isArray(parsed.flags) ? parsed.flags : [],
//     };
//   } catch (imgErr) {
//     console.warn(`  ⚠️  Image analysis failed: ${imgErr.message}`);
//     return {
//       checked: false,
//       reason: `Image could not be analyzed: ${imgErr.message}`,
//       flags: [
//         {
//           type: "Image Load Failed",
//           description: `The image URL is inaccessible or returned an error. This may indicate a broken or fake image link.`,
//           severity: "medium",
//         },
//       ],
//       imageRiskScore: 25,
//       isRelevant: false,
//       isAppropriate: true,
//       isPlaceholder: false,
//     };
//   }
// }
// backend/services/image-analysis.service.js
// GPT-4o Vision image analysis

import { openai } from "../config/openai.js";
import { GENERIC_IMAGE_DOMAINS } from "../utils/constants.js";

export async function analyzeImageWithAI(imageUrl, context) {
  // Case 1: No image URL
  if (!imageUrl || !imageUrl.startsWith("http")) {
    return {
      checked: false,
      reason: "No valid image URL provided",
      flags: [
        {
          type: "Missing Image",
          description:
            "Event/service has no image uploaded. Original photos increase trust.",
          severity: "medium",
        },
      ],
      imageRiskScore: 30,
      isRelevant: false,
      isAppropriate: true,
      isPlaceholder: true,
    };
  }

  // Case 2: Known generic/stock/placeholder domain
  const isGenericDomain = GENERIC_IMAGE_DOMAINS.some((domain) =>
    imageUrl.includes(domain)
  );
  if (isGenericDomain) {
    const domainFound = GENERIC_IMAGE_DOMAINS.find((d) => imageUrl.includes(d));
    return {
      checked: false,
      reason: `Generic stock/placeholder image detected (${domainFound})`,
      flags: [
        {
          type: "Generic Placeholder Image",
          description: `Image is from a stock/placeholder service (${domainFound}). Real events should have original photos specific to the event.`,
          severity: "low",
        },
      ],
      imageRiskScore: 15,
      isRelevant: false,
      isAppropriate: true,
      isPlaceholder: true,
    };
  }

  // Case 3: GPT-4o Vision analysis
  try {
    console.log(`  🖼️  Analyzing image: ${imageUrl.slice(0, 60)}...`);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content:
            "You are a strict image moderation AI for an event platform. Analyze images objectively and return ONLY valid JSON. No preamble, no explanation — just JSON.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this image for event platform moderation.

EVENT CONTEXT:
Title: ${context.title || "N/A"}
Category: ${context.category || "N/A"}
Description: ${(context.description || "N/A").slice(0, 200)}

Return ONLY this JSON (no backticks, no extra text):
{
  "isRelevant": <true if image matches event title/category, false if completely unrelated>,
  "isAppropriate": <true if no NSFW/violent/drug/gore/explicit content, false otherwise>,
  "isPlaceholder": <true if generic stock photo not specific to this event, false if original/specific>,
  "imageRiskScore": <0-100, where 0=perfectly safe+relevant, 100=very risky>,
  "relevanceNote": "<one sentence why relevant or not>",
  "appropriatenessNote": "<describe any content concern, or write 'clean' if none>",
  "placeholderNote": "<why it looks generic or original>",
  "suspiciousText": "<any overlaid text like prices, phone numbers, links? describe exactly or write 'none'>",
  "dominantContent": "<what is primarily shown in the image in 5-7 words>",
  "flags": [{"type": "<short flag name>", "description": "<specific detail about this image>", "severity": "<low|medium|high>"}]
}

Scoring guide:
0-20   = Clean, relevant, original image
21-40  = Generic/stock but harmless
41-60  = Somewhat irrelevant or mildly concerning
61-80  = Clearly wrong image or moderately concerning content
81-100 = NSFW, violent, misleading, or highly suspicious`,
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "low",
              },
            },
          ],
        },
      ],
    });

    const raw = response.choices[0].message.content || "{}";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    const imageRiskScore = Math.min(100, Math.max(0, parsed.imageRiskScore ?? 20));

    console.log(
      `  🖼️  Image result: score=${imageRiskScore} | relevant=${parsed.isRelevant} | appropriate=${parsed.isAppropriate} | placeholder=${parsed.isPlaceholder}`
    );
    if (parsed.dominantContent) {
      console.log(`  🖼️  Dominant content: "${parsed.dominantContent}"`);
    }

    return {
      checked: true,
      imageRiskScore,
      isRelevant: parsed.isRelevant ?? true,
      isAppropriate: parsed.isAppropriate ?? true,
      isPlaceholder: parsed.isPlaceholder ?? false,
      relevanceNote: parsed.relevanceNote ?? "",
      appropriatenessNote: parsed.appropriatenessNote ?? "clean",
      placeholderNote: parsed.placeholderNote ?? "",
      suspiciousText: parsed.suspiciousText ?? "none",
      dominantContent: parsed.dominantContent ?? "",
      flags: Array.isArray(parsed.flags) ? parsed.flags : [],
    };
  } catch (imgErr) {
    console.warn(`  ⚠️  Image analysis failed: ${imgErr.message}`);
    return {
      checked: false,
      reason: `Image could not be analyzed: ${imgErr.message}`,
      flags: [
        {
          type: "Image Load Failed",
          description: `The image URL is inaccessible or returned an error. This may indicate a broken or fake image link.`,
          severity: "medium",
        },
      ],
      imageRiskScore: 25,
      isRelevant: false,
      isAppropriate: true,
      isPlaceholder: false,
    };
  }
}