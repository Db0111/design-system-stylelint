import stylelint from "stylelint";

const ruleName = "design-system/no-hardcoded-font";

const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (prop: string, value: string) =>
    `Hardcoded font value "${value}" detected for "${prop}". Use typography token (e.g., theme.typography.*) instead.`,
});

type Options = {
  /**
   * 허용할 토큰 접근 패턴들 (프로젝트마다 바꿔 끼우기 쉽도록)
   */
  allowedTokenPatterns?: (string | RegExp)[];
  /**
   * font shorthand ("font: ...")도 검사할지
   */
  checkFontShorthand?: boolean;
  /**
   * 예외로 허용할 값들 (normal, inherit 등)
   */
  allowlistValues?: string[];
};

const DEFAULT_OPTIONS: Required<Options> = {
  allowedTokenPatterns: [
    /theme\.typography\.[\w.]+/i,
    /tokens\.typography\.[\w.]+/i,
    /var\(--font-[^)]+\)/i,
    /var\(--typography-[^)]+\)/i,
  ],
  checkFontShorthand: true,
  allowlistValues: [
    "inherit",
    "initial",
    "unset",
    "revert",
    "revert-layer",
    // 폰트 관련에서 자주 쓰는 키워드/값
    "normal",
    "bold",
    "bolder",
    "lighter",
    "0",
  ],
};

function isAllowedByTokenPattern(value: string, patterns: (string | RegExp)[]) {
  return patterns.some((p) =>
    typeof p === "string" ? value.includes(p) : p.test(value)
  );
}

function isAllowedByAllowlist(value: string, allowlist: string[]) {
  const v = value.trim().toLowerCase();
  return allowlist.includes(v);
}

function containsHardcodedFontLiteral(prop: string, value: string) {
  const v = value.trim();

  // 숫자/단위 하드코딩 감지 (font-size, letter-spacing 등)
  const hasNumericWithUnit =
    /\b\d+(\.\d+)?(px|rem|em|pt|%)\b/i.test(v) || /\b\d+(\.\d+)?\b/.test(v);

  // font-family 하드코딩 감지 (따옴표/문자열)
  const hasFontFamilyLiteral =
    /["'][^"']+["']/.test(v) ||
    /(pretendard|inter|roboto|arial|sans-serif|serif)/i.test(v);

  // shorthand는 다양한 값이 섞이므로, 숫자/단위/패밀리 리터럴이 조금이라도 있으면 하드코딩으로 간주
  if (prop === "font") return hasNumericWithUnit || hasFontFamilyLiteral;

  if (prop === "font-weight") {
    // 100~900 숫자 weight 감지
    return /\b([1-9]00)\b/.test(v);
  }

  if (prop === "font-family") {
    return hasFontFamilyLiteral;
  }

  // font-size / line-height / letter-spacing 등
  return hasNumericWithUnit;
}

const rule: stylelint.Rule = (
  primaryOption?: unknown,
  secondaryOptions?: Options
) => {
  const options: Required<Options> = {
    ...DEFAULT_OPTIONS,
    ...(secondaryOptions ?? {}),
  };

  return (root, result) => {
    // rule Option 이 올바르게 들어왔는지 검증
    const valid = stylelint.utils.validateOptions(result, ruleName, {
      actual: primaryOption,
      possible: [true], // 플러그인 enable 여부
    });

    if (!valid) return;

    root.walkDecls((decl) => {
      const prop = decl.prop.toLowerCase();
      const value = decl.value;

      const isFontProp =
        prop === "font-size" ||
        prop === "font-weight" ||
        prop === "line-height" ||
        prop === "letter-spacing" ||
        prop === "font-family" ||
        (options.checkFontShorthand && prop === "font");

      if (!isFontProp) return;

      // 1) allowlist 키워드면 통과
      if (isAllowedByAllowlist(value, options.allowlistValues)) return;

      // 2) 토큰 접근/var() 패턴이면 통과
      if (isAllowedByTokenPattern(value, options.allowedTokenPatterns)) return;

      // 3) calc()/var() 같은 함수 기반(하지만 tokenPatterns에 var를 넣어뒀으니, calc는 여기서 추가 허용)
      if (/^calc\(/i.test(value.trim())) return;

      // 4) 나머지는 하드코딩으로 판단
      if (containsHardcodedFontLiteral(prop, value)) {
        stylelint.utils.report({
          ruleName,
          result,
          node: decl,
          message: messages.rejected(prop, value),
        });
      }
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;

export default stylelint.createPlugin(ruleName, rule);
