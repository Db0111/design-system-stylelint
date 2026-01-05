import { readThemeSource } from "./readThemeSource.js";
import { extractObjectBlock } from "./extractObjectBlock.js";
import { parseColorsHexOnly } from "./parseColorHexCode.js";
import { buildColorReverseMap } from "./buildColorReverseMap.js";

export function buildThemeColorMap(themePath: string) {
  const src = readThemeSource(themePath);
  const block = extractObjectBlock(src, "colors");
  if (!block) throw new Error(`colors block not found in ${themePath}`);

  const colors = parseColorsHexOnly(block);
  const valueToTokens = buildColorReverseMap(colors);

  return { colors, valueToTokens };
}
