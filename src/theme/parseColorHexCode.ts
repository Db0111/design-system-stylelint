/**
 * step 3
 * colors 블록 문자열에서 hex 컬러 토큰만 추출한다. (V1: #RGB / #RRGGBB)
 * 예) primary: "#8052E1" -> { primary: "#8052E1" }
 *
 * 제한:
 * - 값이 변수 참조/함수 호출/스프레드면 추출되지 않음 (V1 정책)
 * - hex 외(rgb/rgba/hsl 등)는 추후 확장
 */
export function parseColorsHexOnly(colorsBlock: string) {
  const re =
    /([A-Za-z0-9_]+)\s*:\s*['"](#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}))['"]\s*,?/g;

  const out: Record<string, string> = {};
  let m: RegExpExecArray | null;

  while ((m = re.exec(colorsBlock))) {
    const key = m[1];
    const hex = m[2];
    out[key] = hex;
  }

  return out;
}
