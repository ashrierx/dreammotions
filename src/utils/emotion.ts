import type { DreamEntry } from "../App";

/**
 * Extract the first "Primary Emotion" from the LLM analysis text.
 * Supports formats like:
 * - "**Primary Emotions**: joy, anxiety"
 * - "1. **Primary Emotions**: joy, anxiety"
 * - "**Primary Emotions**:\n- joy\n- anxiety"
 * - "Primary Emotions: joy, anxiety"
 */
export function extractPrimaryEmotion(analysisText: string): string {
  if (!analysisText) return "unknown";

  // Normalize line endings and whitespace
  const text = analysisText.replace(/\r\n/g, "\n").trim();

  // 1) Look for numbered section "1. **Primary Emotions**:"
  const numberedMatch = text.match(
    /(?:^|\n)\s*1\.\s*\*\*Primary Emotions?\*\*\s*:?\s*([^\n]+)/i
  );
  if (numberedMatch?.[1]) {
    const first = pickFirstEmotion(numberedMatch[1]);
    if (first) return first;
  }

  // 2) Look for bold heading with content on same line
  const sameLineMatch = text.match(
    /\*\*Primary Emotions?\*\*\s*:?\s*([^\n]+)/i
  );
  if (sameLineMatch?.[1]) {
    const first = pickFirstEmotion(sameLineMatch[1]);
    if (first) return first;
  }

  // 3) Look for heading followed by list on next lines
  const headingMatch = text.match(
    /\*\*Primary Emotions?\*\*\s*:?\s*\n+((?:[-*•]\s*[^\n]+\n?)+)/i
  );
  if (headingMatch?.[1]) {
    const firstBullet = headingMatch[1].match(/[-*•]\s*([^\n]+)/);
    if (firstBullet?.[1]) {
      const first = pickFirstEmotion(firstBullet[1]);
      if (first) return first;
    }
  }

  // 4) Fallback: search for common emotion keywords in first 500 chars
  const earlyText = text.slice(0, 500).toLowerCase();
  const commonEmotions = [
    "anxiety",
    "anxious",
    "fear",
    "afraid",
    "scared",
    "joy",
    "joyful",
    "happy",
    "sadness",
    "sad",
    "anger",
    "angry",
    "confusion",
    "confused",
    "peace",
    "peaceful",
    "calm",
    "excitement",
    "excited",
    "nostalgia",
    "nostalgic",
    "curiosity",
    "curious",
  ];

  for (const emotion of commonEmotions) {
    if (earlyText.includes(emotion)) {
      console.log("✅ Found fallback emotion:", emotion);
      // Return base form
      return emotion.replace(/(ious|ful|ed)$/, "").replace(/ness$/, "");
    }
  }

  return "unknown";
}

export function getDreamEmotion(
  dream: Pick<DreamEntry, "emotion" | "interpretation">
): string {
  const stored = (dream.emotion || "").trim().toLowerCase();

  if (
    stored &&
    stored !== "not specified" &&
    stored !== "unknown" &&
    stored !== "" &&
    !stored.includes(",") &&
    !stored.includes(" and ")
  ) {
    return stored;
  }

  const extracted = extractPrimaryEmotion(dream.interpretation || "");

  return extracted;
}

function pickFirstEmotion(raw: string): string | null {
  const clean = raw
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/[()]/g, "")
    .replace(/^[-*•]\s*/, "")
    .replace(/\s+/g, " ")
    .trim();

  // Split by comma, semicolon, "and", or "/"
  const first = clean
    .split(/[,;/]|\s+and\s+/i)[0]
    ?.trim()
    .toLowerCase();

  if (!first) return null;

  const result = first
    .replace(/^(the|a|an)\s+/i, "")
    .replace(/\s+(emotion|emotions|feeling|feelings)$/i, "")
    .replace(/^[-*•]\s*/, "")
    .trim();

  return result || null;
}
