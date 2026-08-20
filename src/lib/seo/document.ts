export const HEAD_SLOT_START = "<!--head-slot-start-->";
export const HEAD_SLOT_END = "<!--head-slot-end-->";
export const APP_SLOT = "<!--app-html-->";
export const STATE_SCRIPT_ID = "__PRELOADED_STATE__";
export const PRERENDER_PATH_ATTR = "data-prerendered-path";

export const REQUIRED_HEAD_TAGS = [
  "charset",
  'name="viewport"',
  "favicon",
  "preconnect",
] as const;

export class DocumentSlotError extends Error {}

function replaceSlot(
  html: string,
  start: string,
  end: string,
  replacement: string,
): string {
  const startIndex = html.indexOf(start);
  const endIndex = html.indexOf(end);

  if (startIndex === -1 || endIndex === -1) {
    throw new DocumentSlotError(
      `Template is missing the ${start} / ${end} markers.`,
    );
  }
  if (endIndex < startIndex) {
    throw new DocumentSlotError(`Template has ${end} before ${start}.`);
  }

  return (
    html.slice(0, startIndex) + replacement + html.slice(endIndex + end.length)
  );
}

export function serializeState(state: unknown): string {
  return JSON.stringify(state ?? {}).replace(/</g, "\\u003c");
}

export function normalizePath(path: string): string {
  if (!path) return "/";
  const withoutQuery = path.split(/[?#]/)[0];
  const trimmed = withoutQuery.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

export function composeDocument({
  template,
  head,
  body,
  preloadedState,
  route,
}: {
  template: string;
  head: string;
  body: string;
  preloadedState: unknown;
  route: string;
}): string {
  if (!template.includes(APP_SLOT)) {
    throw new DocumentSlotError(
      `Template is missing the ${APP_SLOT} marker. Run \`vite build\` before prerendering.`,
    );
  }

  const withHead = replaceSlot(template, HEAD_SLOT_START, HEAD_SLOT_END, head);

  const marked = withHead.replace(
    '<div id="root">',
    () => `<div id="root" ${PRERENDER_PATH_ATTR}="${normalizePath(route)}">`,
  );

  const withBody = marked.replace(APP_SLOT, () => body);

  const stateTag = `  <script type="application/json" id="${STATE_SCRIPT_ID}">${serializeState(preloadedState)}</script>\n  `;

  return withBody.replace("</body>", () => `${stateTag}</body>`);
}

export interface HeadAudit {
  ok: boolean;
  missing: string[];
  titleCount: number;
  descriptionCount: number;
}

export function auditHead(html: string): HeadAudit {
  const headEnd = html.indexOf("</head>");
  const head = headEnd === -1 ? html : html.slice(0, headEnd);

  const missing = REQUIRED_HEAD_TAGS.filter((tag) => !head.includes(tag));
  const titleCount = (head.match(/<title[\s>]/g) ?? []).length;
  const descriptionCount = (head.match(/name="description"/g) ?? []).length;

  return {
    ok: missing.length === 0 && titleCount === 1 && descriptionCount === 1,
    missing: [...missing],
    titleCount,
    descriptionCount,
  };
}

export function readPreloadedState(): unknown {
  if (typeof document === "undefined") return undefined;
  const node = document.getElementById(STATE_SCRIPT_ID);
  if (!node?.textContent) return undefined;
  try {
    return JSON.parse(node.textContent);
  } catch {
    console.warn("Could not parse the preloaded state; starting empty.");
    return undefined;
  }
}
