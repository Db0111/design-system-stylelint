# design-system-stylelint

디자인 시스템을 기준으로 하드코딩된 색상/폰트를 금지하는 Stylelint 플러그인입니다.

## 개발 의도

디자인 시스템을 바탕으로 개발하더라도, 새로운 컴포넌트를 만들거나 새로운 팀원이 합류할 때 컨벤션이 지켜지지 않는 경우가 있습니다.  
이 문제를 줄이기 위해 하드코딩된 색상/폰트를 자동으로 잡아내는 린트 규칙을 만들었습니다.

( \* 현재는 버전 1이기 때문에 규칙을 최소화하여 가장 기본적인 규칙만 명시하였습니다.)

## 설치

```sh
npm i -D design-system-stylelint stylelint postcss-styled-syntax
```

## 사용 방법

### 1) Stylelint 설정 파일 작성

`stylelint.config.js` (ESM):

```js
export default {
  customSyntax: "postcss-styled-syntax",
  plugins: ["design-system-stylelint"],
  rules: {
    "design-system/no-hardcoded-color": [
      true,
      { themePath: "./src/styles/theme.ts" },
    ],
    "design-system/no-hardcoded-font": true,
  },
};
```

### 2) 실행

```sh
stylelint "**/*.{ts,tsx,css}"
```

`package.json`에 스크립트를 추가해도 됩니다.

```json
{
  "scripts": {
    "designlint": "stylelint \"**/*.{ts,tsx,css}\""
  }
}
```

## 규칙 설명

### design-system/no-hardcoded-color

하드코딩된 색상 값(예: `#fff`, `rgb(0,0,0)`)을 금지합니다.  
`themePath` 옵션으로 테마 토큰 파일 경로를 전달해야 합니다.

```js
{
  "design-system/no-hardcoded-color": [
    true,
    { themePath: "./src/styles/theme.ts" }
  ]
}
```

### design-system/no-hardcoded-font

하드코딩된 폰트 값(예: `font-family: "Arial"`)을 금지합니다.

```js
{
  "design-system/no-hardcoded-font": true
}
```

## 사용 예시

### 잘못된 예시 (경고 발생)

```tsx
const Box = styled.div`
  color: #111;
  background: rgb(255, 255, 255);
  font-family: "Arial";
`;
```

### 올바른 예시 (토큰 사용)

```tsx
const Box = styled.div`
  color: ${theme.colors.text.primary};
  background: ${theme.colors.background.default};
  font-family: ${theme.fonts.body};
`;
```

## 참고

- `themePath`는 실제 프로젝트의 테마 파일 경로로 변경해야 합니다.
