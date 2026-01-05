import stylelint from "stylelint";
import { buildThemeColorMap } from "../theme/buildThemeColorMap.js";
import { normalizeHex } from "../theme/normalizeHex.js";

const ruleName = "design-system/no-hardcoded-color";

const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (value: string) =>
    `Hardcoded color "${value}" detected. Use theme.colors.* token instead.`,
  suggested: (value: string, token: string) =>
    `Hardcoded color "${value}" detected. Use ${token}.`,
});

type RuleOptions = {
  themePath: string; // 예: "./src/styles/theme.ts"
};

// hex (#fff  #ffffff 방지)
const HEX_COLOR_REX = /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/;

// 간단 캐시: 같은 themePath면 한 번만 파싱
let cached: {
  themePath: string;
  valueToTokens: Map<string, string[]>;
} | null = null;

function getValueToTokens(themePath: string) {
  if (cached?.themePath === themePath) return cached.valueToTokens;

  const { valueToTokens } = buildThemeColorMap(themePath);
  cached = { themePath, valueToTokens };
  return valueToTokens;
}

const rule: stylelint.Rule = (primary, options?: RuleOptions) => {
  return (root, result) => {
    // 플러그인 enable 체크
    const valid = stylelint.utils.validateOptions(result, ruleName, {
      actual: primary,
      possible: [true],
    });
    if (!valid) return;

    if (!options?.themePath) {
      stylelint.utils.report({
        ruleName,
        result,
        node: root,
        message: `[${ruleName}] option "themePath" is required.`,
      });
      return;
    }

    const valueToTokens = getValueToTokens(options.themePath);

    root.walkDecls((decl) => {
      const prop = decl.prop.toLowerCase();

      const isColorProp =
        prop === "color" ||
        prop === "background" ||
        prop === "background-color" ||
        prop === "border-color";

      if (!isColorProp) return;

      const match = decl.value.match(HEX_COLOR_REX);
      if (!match) return;

      const rawHex = match[0];
      const norm = normalizeHex(rawHex); // "#8052E1" -> "#8052e1", "#fff" -> "#ffffff"

      const tokens = valueToTokens.get(norm);

      // DS004: 토큰 값과 정확히 일치하면 구체 토큰 추천
      if (tokens?.length) {
        stylelint.utils.report({
          ruleName,
          result,
          node: decl,
          message: messages.suggested(rawHex, tokens[0]),
        });
        return;
      }

      // DS001: 그냥 하드코딩 색상 경고
      stylelint.utils.report({
        ruleName,
        result,
        node: decl,
        message: messages.rejected(rawHex),
      });
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;

export default stylelint.createPlugin(ruleName, rule);
