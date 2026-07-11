import { describe, it, expect } from "vitest";
import { createRandom, hashSeed } from "../random";

describe("hashSeed", () => {
  it("returns the same hash for the same seed", () => {
    expect(hashSeed("abc")).toBe(hashSeed("abc"));
  });

  it("returns different hashes for different seeds", () => {
    expect(hashSeed("abc")).not.toBe(hashSeed("abd"));
  });
});

describe("createRandom", () => {
  it("produces the same sequence for the same seed", () => {
    const a = createRandom("wall");
    const b = createRandom("wall");
    for (let i = 0; i < 100; i++) {
      expect(a()).toBe(b());
    }
  });

  it("produces different sequences for different seeds", () => {
    const a = createRandom("wall");
    const b = createRandom("html");
    const sequenceA = Array.from({ length: 10 }, () => a());
    const sequenceB = Array.from({ length: 10 }, () => b());
    expect(sequenceA).not.toEqual(sequenceB);
  });

  it("returns values in [0, 1)", () => {
    const random = createRandom("range");
    for (let i = 0; i < 1000; i++) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});
