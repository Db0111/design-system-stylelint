/**
 * step 2
 * key 값을 바탕으로 객체를 추출한다.
 */

export function extractObjectBlock(src: string, key: string) {
  const idx = src.indexOf(`${key}:`);
  if (idx < 0) return null;

  const start = src.indexOf("{", idx);
  if (start < 0) return null;

  let depth = 0;
  for (let i = start; i < src.length; i++) {
    const ch = src[i];
    if (ch === "{") depth++;
    else if (ch === "}") depth--;

    if (depth === 0) return src.slice(start, i + 1);
  }
  return null;
}
