import { checklist, stages } from "./workspace.js";

export function createResearchBrief(topic, research = {}) {
  if (!topic?.title || !Array.isArray(topic.keywords))
    throw new Error("A topic is required");
  const completed = Array.isArray(research.completed) ? research.completed : [];
  return [
    "# SIGNAL · Creator Research Brief",
    "",
    `Topic: ${topic.title}`,
    `Category: ${topic.category}`,
    `Format: ${topic.format}`,
    `Stage: ${stages.includes(research.stage) ? research.stage : "Idea"}`,
    "",
    "## Concept",
    topic.description,
    "",
    "## Suggested angle",
    topic.angle,
    "",
    "## Search terms to validate",
    ...topic.keywords.map((k) => `- ${k}`),
    "",
    "## Research checklist",
    ...checklist.map(
      (item, i) => `- [${completed.includes(i) ? "x" : " "}] ${item}`,
    ),
    "",
    "## Your research notes",
    research.notes || "No research notes yet.",
    "",
    "## Comparable video evidence",
    "| Video URL | Publish date | Views observed | Channel subscribers | Observation date | Why relevant |",
    "| --- | --- | --- | --- | --- | --- |",
    "| | | | | | |",
    "| | | | | | |",
    "",
    "## Decision",
    "Go / Revise / Pass:",
    "Evidence supporting decision:",
    "Risks and unknowns:",
    "",
    "**Data disclosure:** SIGNAL's topic scores, competition labels, and charts are illustrative demo fixtures. They are not observed YouTube analytics, trend measurements, or predictions. Validate independently.",
  ].join("\n");
}

export function briefFilename(topic) {
  return `signal-${
    topic.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "idea"
  }-brief.md`;
}
