/**
 * step 4-1
   비교를 위해 값을 통일
	•	#FFF → #ffffff
	•	#8052E1 → #8052e1
*/

export function normalizeHex(hex: string) {
  const s = hex.trim().toLowerCase();

  const m3 = s.match(/^#([0-9a-f]{3})$/i);
  if (m3) {
    const t = m3[1];
    return `#${t[0]}${t[0]}${t[1]}${t[1]}${t[2]}${t[2]}`;
  }

  const m6 = s.match(/^#([0-9a-f]{6})$/i);
  if (m6) return `#${m6[1]}`;

  return s;
}
