import stylelint from "stylelint";

const ruleName = "design-system/no-hardcoded-color";

const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (value: string) =>
    `Hardcoded color "${value}" detected. Use theme.colors.* token instead.`,
});

// hex (#fff  #ffffff 방지)
const HEX_COLOR_REX = /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/;

const rule: stylelint.Rule = () => {
  return (root, result) => {
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

      stylelint.utils.report({
        ruleName,
        result,
        node: decl,
        message: messages.rejected(match[0]),
      });
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;

export default stylelint.createPlugin(ruleName, rule);
