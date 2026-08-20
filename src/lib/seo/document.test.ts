import { describe, expect, it } from "vitest";
import {
  APP_SLOT,
  DocumentSlotError,
  HEAD_SLOT_END,
  HEAD_SLOT_START,
  auditHead,
  composeDocument,
  normalizePath,
  serializeState,
} from "./document";

const TEMPLATE = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="/favicon.ico" sizes="32x32" />
    <link rel="preconnect" href="https://image.tmdb.org" crossorigin />
    ${HEAD_SLOT_START}
    <title>React Movies</title>
    <meta name="description" content="Default description." />
    ${HEAD_SLOT_END}
  </head>
  <body>
    <div id="root">${APP_SLOT}</div>
  </body>
</html>
`;

const ROUTE_HEAD = `<title data-rh="true">Movies | React Movies</title>
<meta data-rh="true" name="description" content="Route description."/>
<link data-rh="true" rel="canonical" href="https://example.com/movies"/>`;

function compose(head = ROUTE_HEAD, body = "<main>hi</main>") {
  return composeDocument({
    template: TEMPLATE,
    head,
    body,
    preloadedState: { tmdb: { queries: {} } },
    route: "/movies",
  });
}

describe("composeDocument", () => {
  it("injects the route head and body", () => {
    const html = compose();
    expect(html).toContain("Movies | React Movies");
    expect(html).toContain("<main>hi</main>");
  });

  // The previous regex-based dedupe started at the first <meta> in the
  // document and consumed everything up to the description, silently deleting
  // charset, viewport, favicon and preconnect from every prerendered page.
  it("preserves every tag outside the head slot", () => {
    const html = compose();
    expect(html).toContain('<meta charset="UTF-8" />');
    expect(html).toContain('name="viewport"');
    expect(html).toContain('href="/favicon.ico"');
    expect(html).toContain("preconnect");
  });

  it("replaces the defaults rather than duplicating them", () => {
    const html = compose();
    const head = html.slice(0, html.indexOf("</head>"));
    expect((head.match(/<title/g) ?? []).length).toBe(1);
    expect((head.match(/name="description"/g) ?? []).length).toBe(1);
    expect(head).not.toContain("Default description.");
  });

  it("leaves no slot markers in the output", () => {
    const html = compose();
    expect(html).not.toContain(HEAD_SLOT_START);
    expect(html).not.toContain(HEAD_SLOT_END);
    expect(html).not.toContain(APP_SLOT);
  });

  it("embeds the preloaded state as parseable JSON", () => {
    const html = compose();
    const match = html.match(
      /<script type="application\/json" id="__PRELOADED_STATE__">([\s\S]*?)<\/script>/,
    );
    expect(match).not.toBeNull();
    expect(() => JSON.parse(match![1].replace(/\\u003c/g, "<"))).not.toThrow();
  });

  // A movie overview containing "</script>" must not break out of the tag.
  it("escapes markup inside the serialised state", () => {
    const html = composeDocument({
      template: TEMPLATE,
      head: ROUTE_HEAD,
      body: "<main></main>",
      preloadedState: { evil: "</script><script>alert(1)</script>" },
      route: "/movies",
    });
    const stateTag = html.slice(html.indexOf('id="__PRELOADED_STATE__"'));
    expect(stateTag).not.toContain("</script><script>alert(1)");
    expect(html).not.toContain("alert(1)</script>");
  });

  // Body HTML containing "$&" or "$'" would be mangled by String.replace
  // if the replacement were a string rather than a function.
  it("does not interpret replacement patterns in the body", () => {
    const html = composeDocument({
      template: TEMPLATE,
      head: ROUTE_HEAD,
      body: "<p>$& $' $` price</p>",
      preloadedState: {},
      route: "/movies",
    });
    expect(html).toContain("<p>$& $' $` price</p>");
  });

  it("fails loudly when the template has no app slot", () => {
    expect(() =>
      composeDocument({
        template: "<html><head></head><body></body></html>",
        head: ROUTE_HEAD,
        body: "",
        preloadedState: {},
        route: "/movies",
      }),
    ).toThrow(DocumentSlotError);
  });

  it("fails loudly when the head slot markers are missing", () => {
    expect(() =>
      composeDocument({
        template: `<html><head></head><body><div>${APP_SLOT}</div></body></html>`,
        head: ROUTE_HEAD,
        body: "",
        preloadedState: {},
        route: "/movies",
      }),
    ).toThrow(DocumentSlotError);
  });
});

describe("serializeState", () => {
  it("escapes < so a closing script tag cannot appear", () => {
    expect(serializeState({ a: "</script>" })).not.toContain("</script>");
    expect(serializeState({ a: "</script>" })).toContain("\\u003c");
  });

  it("round-trips through JSON.parse", () => {
    const state = { tmdb: { queries: { "movie(1)": { data: { id: 1 } } } } };
    const raw = serializeState(state).replace(/\\u003c/g, "<");
    expect(JSON.parse(raw)).toEqual(state);
  });

  it("handles null and undefined", () => {
    expect(serializeState(undefined)).toBe("{}");
    expect(serializeState(null)).toBe("{}");
  });
});

describe("auditHead", () => {
  it("passes a complete head", () => {
    expect(auditHead(compose()).ok).toBe(true);
  });

  it("reports each missing required tag", () => {
    const audit = auditHead("<html><head><title>x</title></head>");
    expect(audit.ok).toBe(false);
    expect(audit.missing).toContain("charset");
    expect(audit.missing).toContain('name="viewport"');
    expect(audit.missing).toContain("favicon");
    expect(audit.missing).toContain("preconnect");
  });

  it("catches a duplicated title", () => {
    const html = compose(`${ROUTE_HEAD}\n<title>second</title>`);
    const audit = auditHead(html);
    expect(audit.titleCount).toBe(2);
    expect(audit.ok).toBe(false);
  });

  it("catches a duplicated description", () => {
    const html = compose(
      `${ROUTE_HEAD}\n<meta name="description" content="again"/>`,
    );
    expect(auditHead(html).descriptionCount).toBe(2);
    expect(auditHead(html).ok).toBe(false);
  });
});

describe("prerender path marker", () => {
  it("stamps the route the document was rendered for", () => {
    const html = compose();
    expect(html).toContain('data-prerendered-path="/movies"');
  });

  // Without this marker, the SPA fallback served the prerendered HOME page for
  // every /movie/:id, /series/:id and /search/* URL, and main.tsx hydrated
  // home's DOM into a completely different tree - React #418 and #423.
  it("lets the client tell a matching document from a mismatched one", () => {
    const html = compose();
    const marker = html.match(/data-prerendered-path="([^"]+)"/)?.[1];
    expect(normalizePath(marker ?? "")).toBe("/movies");
    expect(normalizePath("/movie/550/fight-club")).not.toBe(marker);
  });
});

describe("normalizePath", () => {
  it.each([
    ["/", "/"],
    ["", "/"],
    ["/movies", "/movies"],
    ["/movies/", "/movies"],
    ["/movies///", "/movies"],
    ["/movies?page=2", "/movies"],
    ["/movies#top", "/movies"],
  ])("normalizes %o to %o", (input, expected) => {
    expect(normalizePath(input)).toBe(expected);
  });
});
