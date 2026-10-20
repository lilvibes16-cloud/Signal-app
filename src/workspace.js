export const SAVED_KEY = "signal.savedIdeas.v1";
export const RESEARCH_KEY = "signal.research.v1";
export const stages = ["Idea", "Researching", "Ready to film", "Published"];
export const checklist = [
  "Review five recent comparable videos",
  "Record source links and observed metrics in your notes",
  "Check demand across multiple creators",
  "Choose a distinct audience problem or curiosity hook",
  "Verify facts and sources before scripting",
  "Draft three titles and thumbnail concepts",
  "Set a realistic production scope and publishing date",
];

export function normalizeSaved(value, validIds) {
  return Array.isArray(value)
    ? [
        ...new Set(
          value.filter((id) => typeof id === "string" && validIds.includes(id)),
        ),
      ]
    : [];
}

export function normalizeResearch(value, validIds) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    validIds
      .filter((id) => value[id] && typeof value[id] === "object")
      .map((id) => {
        const entry = value[id];
        return [
          id,
          {
            stage: stages.includes(entry.stage) ? entry.stage : "Idea",
            notes:
              typeof entry.notes === "string"
                ? entry.notes.slice(0, 10000)
                : "",
            completed: Array.isArray(entry.completed)
              ? [
                  ...new Set(
                    entry.completed.filter(
                      (i) =>
                        Number.isInteger(i) && i >= 0 && i < checklist.length,
                    ),
                  ),
                ]
              : [],
          },
        ];
      }),
  );
}

export function readStored(storage, key, normalize) {
  try {
    return {
      value: normalize(JSON.parse(storage.getItem(key) || "null")),
      error: false,
    };
  } catch {
    return { value: normalize(null), error: true };
  }
}

export function writeStored(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function sortTopics(items, sort = "score") {
  const competition = { Low: 0, Medium: 1, High: 2 };
  return [...items].sort((a, b) =>
    sort === "title"
      ? a.title.localeCompare(b.title)
      : sort === "competition"
        ? competition[a.competition] - competition[b.competition] ||
          b.score - a.score
        : b.score - a.score,
  );
}
