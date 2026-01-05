import { readThemeSource } from "./readThemeSource";
import { extractObjectBlock } from "./extractObjectBlock";
import { parseColorsHexOnly } from "./parseColorHexCode";
import { buildColorReverseMap } from "./buildColorReverseMap";

export function buildThemeColorMap(themePath: string) {
  const src = readThemeSource(themePath);
  const block = extractObjectBlock(src, "colors");
  if (!block) throw new Error(`colors block not found in ${themePath}`);

  const colors = parseColorsHexOnly(block);
  const valueToTokens = buildColorReverseMap(colors);

  return { colors, valueToTokens };
}
