import { Fragment, type ReactNode } from "react";

const KEYWORDS = new Set([
  "function",
  "const",
  "let",
  "return",
  "if",
  "else",
  "useState",
  "useRef",
  "useEffect",
  "useMemo",
  "import",
  "export",
  "default",
  "from",
  "new",
  "void",
  "true",
  "false",
  "null",
  "typeof",
  "interface",
  "type",
]);

// Order matters: comments/strings first so keyword matching never splits them.
const TOKEN_RE =
  /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|-?\b\d+\.?\d*\b|[A-Za-z_$][\w$]*|[{}()[\];:.,<>=+\-*/%!&|]+|\s+)/g;

/** Small, dependency-free syntax highlighter — good enough for short CSS/TSX snippets. */
export function highlight(code: string): ReactNode {
  const tokens = code.match(TOKEN_RE) ?? [code];
  return (
    <Fragment>
      {tokens.map((tok, i) => {
        let cls: string | null = null;
        if (/^\/\*[\s\S]*\*\/$|^\/\/.*/.test(tok)) cls = "tok-comment";
        else if (/^["'`]/.test(tok)) cls = "tok-string";
        else if (/^-?\d/.test(tok)) cls = "tok-number";
        else if (KEYWORDS.has(tok)) cls = "tok-keyword";
        else if (/^[{}()[\];:.,<>=+\-*/%!&|]+$/.test(tok)) cls = "tok-punct";
        else if (/^[A-Z]/.test(tok)) cls = "tok-component";
        else if (/^[a-z-]+$/.test(tok) && tok.includes("-")) cls = "tok-property";

        return cls ? (
          <span key={i} className={cls}>
            {tok}
          </span>
        ) : (
          <Fragment key={i}>{tok}</Fragment>
        );
      })}
    </Fragment>
  );
}
