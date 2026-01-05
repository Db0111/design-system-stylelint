import { normalizeHex } from "./normalizeHex.js";

/**
 * step 4
 * 목표: "#8052e1" -> ["theme.colors.primary"]
 */

export function buildColorReverseMap(
  colors: Record<string, string>,
  tokenPrefix = "theme.colors."
) {
  const valueToTokens = new Map<string, string[]>();

  for (const [key, value] of Object.entries(colors)) {
    const norm = normalizeHex(value);
    const token = `${tokenPrefix}${key}`;

    const arr = valueToTokens.get(norm) ?? [];
    arr.push(token);
    valueToTokens.set(norm, arr);
  }

  return valueToTokens;
}
