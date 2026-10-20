import React from "react";
import { Download, ExternalLink, ClipboardCheck } from "lucide-react";
import { checklist, stages } from "../workspace.js";
import { briefFilename, createResearchBrief } from "../research.js";

export default function ResearchWorkspace({
  topic,
  value,
  onChange,
  storageFailed,
}) {
  const research = value || { stage: "Idea", notes: "", completed: [] };
  function update(patch) {
    onChange({ ...research, ...patch });
  }
  function download() {
    const blob = new Blob([createResearchBrief(topic, research)], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = briefFilename(topic);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section
      className="panel researchWorkspace"
      aria-labelledby="research-heading"
    >
      <div className="sectionTitle">
        <div>
          <div className="eyebrow">FROM IDEA TO PRODUCTION</div>
          <h2 id="research-heading">Your research workspace</h2>
        </div>
        <button className="primary" onClick={download}>
          <Download size={16} /> Download brief
        </button>
      </div>
      <p>
        Build your own evidence before filming. The example score above does not
        validate this idea.
      </p>
      <div className="researchGrid">
        <div>
          <label className="fieldLabel" htmlFor="idea-stage">
            Production stage
          </label>
          <select
            id="idea-stage"
            value={research.stage}
            onChange={(e) => update({ stage: e.target.value })}
          >
            {stages.map((stage) => (
              <option key={stage}>{stage}</option>
            ))}
          </select>
          <h3>
            <ClipboardCheck size={16} aria-hidden="true" /> Research checklist{" "}
            <span className="muted">
              {research.completed.length}/{checklist.length}
            </span>
          </h3>
          <div className="checklist">
            {checklist.map((item, i) => (
              <label key={item}>
                <input
                  type="checkbox"
                  checked={research.completed.includes(i)}
                  onChange={() =>
                    update({
                      completed: research.completed.includes(i)
                        ? research.completed.filter((n) => n !== i)
                        : [...research.completed, i],
                    })
                  }
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="fieldLabel" htmlFor="research-notes">
            Notes and source links
          </label>
          <textarea
            id="research-notes"
            maxLength={10000}
            rows={9}
            value={research.notes}
            placeholder="Paste video links, dates, views you observed, your hook, and what makes your version different…"
            onChange={(e) => update({ notes: e.target.value })}
          />
          <div className="notesMeta">
            <span>
              {storageFailed
                ? "Not saved to browser — download your brief before leaving."
                : "Saved automatically in this browser only."}
            </span>
            <span>{research.notes.length}/10,000</span>
          </div>
          <div
            className="researchLinks"
            aria-label="External research searches"
          >
            {topic.keywords.map((keyword) => (
              <a
                key={keyword}
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(keyword)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {keyword}
                <ExternalLink size={13} />
                <span className="srOnly"> — search YouTube in a new tab</span>
              </a>
            ))}
          </div>
          <p className="muted">
            These links open YouTube searches. SIGNAL does not import or verify
            their results.
          </p>
        </div>
      </div>
    </section>
  );
}
