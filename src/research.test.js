import test from "node:test";
import assert from "node:assert/strict";
import { createResearchBrief } from "./research.js";
import { topics } from "./data.js";
test("brief includes topic and validation checklist", () => {
  const brief = createResearchBrief(topics[0]);
  assert.match(brief, /AI tools that actually save creators time/);
  assert.match(brief, /Comparable video evidence/);
  assert.match(brief, /illustrative demo fixtures/);
});
test("brief rejects invalid topic", () =>
  assert.throws(() => createResearchBrief(null)));
test("brief exports personal progress and notes while retaining demo disclosure", () => {
  const brief = createResearchBrief(topics[0], {
    stage: "Researching",
    notes: "Source: https://example.com\nObserved 2026-10-20",
    completed: [0],
  });
  assert.match(brief, /Stage: Researching/);
  assert.match(brief, /\[x\] Review five recent comparable videos/);
  assert.match(brief, /\[ \] Verify facts/);
  assert.match(brief, /Source: https:\/\/example.com\nObserved 2026-10-20/);
  assert.match(brief, /not observed YouTube analytics/);
});
