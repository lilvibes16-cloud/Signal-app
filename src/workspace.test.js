import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeSaved,
  normalizeResearch,
  readStored,
  writeStored,
  sortTopics,
} from "./workspace.js";
import { topics } from "./data.js";
const ids = topics.map((t) => t.id);

test("existing watchlists survive normalization; stale and duplicate ids do not", () => {
  assert.deepEqual(normalizeSaved(["a", "a", "deleted", 42, "b"], ids), [
    "a",
    "b",
  ]);
  assert.deepEqual(normalizeSaved({}, ids), []);
});
test("corrupt JSON and denied storage reads recover without crashing", () => {
  const normalize = (value) => normalizeSaved(value, ids);
  assert.deepEqual(readStored({ getItem: () => "{" }, "key", normalize), {
    value: [],
    error: true,
  });
  assert.deepEqual(readStored(null, "key", normalize), {
    value: [],
    error: true,
  });
});
test("storage writes report quota and privacy failures instead of throwing", () => {
  assert.equal(
    writeStored(
      {
        setItem() {
          throw new Error("QuotaExceededError");
        },
      },
      "key",
      ["a"],
    ),
    false,
  );
  const memory = new Map();
  const storage = {
    setItem: (key, value) => memory.set(key, value),
    getItem: (key) => memory.get(key),
  };
  assert.equal(writeStored(storage, "key", ["b"]), true);
  assert.deepEqual(
    readStored(storage, "key", (value) => normalizeSaved(value, ids)),
    { value: ["b"], error: false },
  );
});
test("research state validates restored stage, notes and checklist entries", () => {
  assert.deepEqual(
    normalizeResearch(
      {
        a: { stage: "invalid", notes: 5, completed: [0, 0, 6, 7, -1, "1"] },
        z: { notes: "stale" },
      },
      ids,
    ),
    { a: { stage: "Idea", notes: "", completed: [0, 6] } },
  );
  assert.deepEqual(normalizeResearch(null, ids), {});
  const valid = {
    b: {
      stage: "Researching",
      notes: "A source and observation date",
      completed: [2],
    },
  };
  assert.deepEqual(normalizeResearch(valid, ids), valid);
});
test("sorting uses demo competition then score and preserves fixture order", () => {
  const original = topics.map((t) => t.id);
  assert.deepEqual(
    sortTopics(topics, "competition").map((t) => t.id),
    ["b", "e", "a", "c", "d", "f"],
  );
  assert.deepEqual(
    topics.map((t) => t.id),
    original,
  );
  assert.equal(sortTopics(topics, "title")[0].id, "a");
});
