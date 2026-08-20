import { describe, expect, it } from "vitest";
import {
  formatCurrency,
  formatDate,
  formatGender,
  formatRating,
  formatRuntime,
  formatScore,
  formatYear,
  groupBy,
  toIsoDuration,
  truncate,
  uniqueById,
} from "./format";

describe("formatRuntime", () => {
  it("splits minutes into hours and minutes", () => {
    expect(formatRuntime(139)).toBe("2h 19m");
  });

  it("omits the empty unit", () => {
    expect(formatRuntime(120)).toBe("2h");
    expect(formatRuntime(45)).toBe("45m");
  });

  it.each([null, undefined, 0])("returns null for %s", (value) => {
    expect(formatRuntime(value)).toBeNull();
  });
});

describe("toIsoDuration", () => {
  it("emits a schema.org duration", () => {
    expect(toIsoDuration(139)).toBe("PT2H19M");
    expect(toIsoDuration(60)).toBe("PT1H");
    expect(toIsoDuration(30)).toBe("PT30M");
  });
});

describe("formatDate / formatYear", () => {
  it("formats an ISO date", () => {
    expect(formatDate("1999-10-15")).toBe("15 October 1999");
    expect(formatYear("1999-10-15")).toBe("1999");
  });

  it("rejects unparseable input rather than printing Invalid Date", () => {
    expect(formatDate("not-a-date")).toBeNull();
    expect(formatDate("")).toBeNull();
    expect(formatYear(null)).toBeNull();
  });
});

describe("formatCurrency", () => {
  it("formats US dollars without decimals", () => {
    expect(formatCurrency(63000000)).toBe("$63,000,000");
  });

  it("treats zero as unknown", () => {
    expect(formatCurrency(0)).toBeNull();
    expect(formatCurrency(null)).toBeNull();
  });
});

describe("formatScore / formatRating", () => {
  it("converts a vote average to a percentage and a decimal", () => {
    expect(formatScore(8.4)).toBe("84%");
    expect(formatRating(8.4)).toBe("8.4");
  });

  it("never renders NaN for a missing rating", () => {
    expect(formatScore(0)).toBeNull();
    expect(formatRating(null)).toBe("0.0");
    expect(formatRating(undefined)).toBe("0.0");
  });
});

describe("formatGender", () => {
  it("maps TMDB's integer codes to words", () => {
    expect(formatGender(1)).toBe("Female");
    expect(formatGender(2)).toBe("Male");
    expect(formatGender(3)).toBe("Non-binary");
    expect(formatGender(0)).toBe("Not specified");
    expect(formatGender(null)).toBe("Not specified");
  });
});

describe("truncate", () => {
  it("leaves short strings alone", () => {
    expect(truncate("short", 20)).toBe("short");
  });

  it("cuts on a word boundary", () => {
    const result = truncate("the quick brown fox jumps", 13);
    expect(result).toBe("the quick\u2026");
  });

  it("handles empty input", () => {
    expect(truncate(null, 10)).toBe("");
  });
});

describe("uniqueById", () => {
  it("keeps the last entry per id", () => {
    const items = [
      { id: 1, name: "a" },
      { id: 2, name: "b" },
      { id: 1, name: "c" },
    ];
    expect(uniqueById(items)).toEqual([
      { id: 1, name: "c" },
      { id: 2, name: "b" },
    ]);
  });
});

describe("groupBy", () => {
  it("groups crew by department", () => {
    const crew = [
      { name: "a", department: "Directing" },
      { name: "b", department: "Writing" },
      { name: "c", department: "Directing" },
    ];
    const grouped = groupBy(crew, (member) => member.department);
    expect(Object.keys(grouped).sort()).toEqual(["Directing", "Writing"]);
    expect(grouped.Directing).toHaveLength(2);
  });
});
