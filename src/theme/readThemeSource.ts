import fs from "node:fs";
import path from "node:path";

/**
 * step 1
 * theme 파일의 원본 소스를 문자열로 읽어온다.
 * 런타임 import 없이 디자인 토큰을 정적 분석하기 위한 용도.
 */

export function readThemeSource(themePath: string) {
  const abs = path.isAbsolute(themePath)
    ? themePath
    : path.resolve(process.cwd(), themePath);

  return fs.readFileSync(abs, "utf8");
}
