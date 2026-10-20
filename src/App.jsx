import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  Compass,
  Flame,
  LayoutDashboard,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { topics, categories, formats, filterTopics } from "./data.js";
import Trend from "./components/Trend.jsx";
import ResearchWorkspace from "./components/ResearchWorkspace.jsx";
import { usePersistentState } from "./hooks/usePersistentState.js";
import {
  SAVED_KEY,
  RESEARCH_KEY,
  normalizeSaved,
  normalizeResearch,
  sortTopics,
} from "./workspace.js";
const validIds = topics.map((t) => t.id);
const cleanSaved = (value) => normalizeSaved(value, validIds);
const cleanResearch = (value) => normalizeResearch(value, validIds);
export default function App() {
  const [page, setPage] = useState("home"),
    [selected, setSelected] = useState(null),
    [query, setQuery] = useState(""),
    [category, setCategory] = useState("All"),
    [format, setFormat] = useState("All"),
    [saved, setSaved, savedFailed] = usePersistentState(SAVED_KEY, cleanSaved),
    [research, setResearch, researchFailed] = usePersistentState(
      RESEARCH_KEY,
      cleanResearch,
    ),
    [sort, setSort] = useState("score"),
    [menu, setMenu] = useState(false);
  const storageFailed = savedFailed || researchFailed;
  const sidebarRef = useRef(null);
  const menuButtonRef = useRef(null);
  useEffect(() => {
    if (!menu) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const buttons = sidebarRef.current.querySelectorAll("button");
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    first.focus();
    function handleKey(e) {
      if (e.key === "Escape") setMenu(false);
      if (e.key === "Tab" && e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (
        e.key === "Tab" &&
        !e.shiftKey &&
        document.activeElement === last
      ) {
        e.preventDefault();
        first.focus();
      }
    }
    const media = window.matchMedia("(max-width: 760px)");
    const closeOnDesktop = () => {
      if (!media.matches) setMenu(false);
    };
    media.addEventListener("change", closeOnDesktop);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
      media.removeEventListener("change", closeOnDesktop);
      menuButtonRef.current?.focus();
    };
  }, [menu]);
  function clearFilters() {
    setQuery("");
    setCategory("All");
    setFormat("All");
  }
  const visible = useMemo(
    () =>
      sortTopics(
        filterTopics(topics, { query, category, format }).filter(
          (t) => page !== "saved" || saved.includes(t.id),
        ),
        sort,
      ),
    [query, category, format, page, saved, sort],
  );
  function navigate(next) {
    setPage(next);
    setSelected(null);
    setMenu(false);
    clearFilters();
  }
  function toggle(id) {
    setSaved((old) =>
      old.includes(id) ? old.filter((x) => x !== id) : [...old, id],
    );
  }
  const openTopic = (t) => {
    setSelected(t);
    setMenu(false);
  };
  return (
    <div className="app">
      <aside
        ref={sidebarRef}
        id="workspace-navigation"
        className={menu ? "sidebar open" : "sidebar"}
      >
        <div className="brand">
          <div className="brandIcon">
            <Activity size={23} />
          </div>
          <span>
            SIGNAL<span className="brandDot">.</span>
          </span>
          <button
            className="mobileClose"
            aria-label="Close menu"
            onClick={() => setMenu(false)}
          >
            <X size={20} />
          </button>
        </div>
        <div className="sideLabel">WORKSPACE</div>
        <nav aria-label="Main navigation">
          <button
            className={page === "home" && !selected ? "nav active" : "nav"}
            onClick={() => navigate("home")}
          >
            <LayoutDashboard size={18} />
            Overview
          </button>
          <button
            className={page === "discover" && !selected ? "nav active" : "nav"}
            onClick={() => navigate("discover")}
          >
            <Compass size={18} />
            Discover
          </button>
          <button
            className={page === "saved" && !selected ? "nav active" : "nav"}
            onClick={() => navigate("saved")}
          >
            <Bookmark size={18} />
            Saved ideas <span className="navCount">{saved.length}</span>
          </button>
        </nav>
        <div className="sidebarBottom">
          <div className="demoPanel">
            <ShieldCheck size={18} />
            <strong>Demo environment</strong>
            <p>Illustrative topics and signals. No live YouTube connection.</p>
          </div>
          <div className="userAvatar">S</div>
          <div className="userText">
            <strong>Creator workspace</strong>
            <span>Free demo access</span>
          </div>
        </div>
      </aside>
      {menu && (
        <button
          className="scrim"
          tabIndex={-1}
          aria-label="Close navigation"
          onClick={() => setMenu(false)}
        />
      )}
      <main className="main" inert={menu ? "" : undefined}>
        <header className="topbar">
          <button
            ref={menuButtonRef}
            className="menuBtn"
            aria-label="Open navigation"
            aria-expanded={menu}
            aria-controls="workspace-navigation"
            onClick={() => setMenu(true)}
          >
            <Menu size={22} />
          </button>
          <div className="breadcrumb">
            WORKSPACE <span>/</span>{" "}
            {selected
              ? "TOPIC INTELLIGENCE"
              : page === "saved"
                ? "WATCHLIST"
                : page === "discover"
                  ? "DISCOVER"
                  : "OVERVIEW"}
          </div>
          <div className="topRight">
            <span className="liveDot" /> DEMO MODE{" "}
            <span className="avatarSmall">S</span>
          </div>
        </header>
        <div className="content">
          {storageFailed && (
            <div className="storageWarning" role="alert">
              Browser storage is unavailable. Changes will last only for this
              session. Download your research briefs before leaving.
            </div>
          )}
          {selected ? (
            <>
              <button className="back" onClick={() => setSelected(null)}>
                <ChevronLeft size={17} /> Back to{" "}
                {page === "saved" ? "watchlist" : "opportunities"}
              </button>
              <div className="detailHero">
                <div className="eyebrow">
                  <Sparkles size={15} /> TOPIC INTELLIGENCE · DEMO
                </div>
                <h1>{selected.title}</h1>
                <p>{selected.description}</p>
                <div className="detailActions">
                  <button
                    className="primary"
                    onClick={() => toggle(selected.id)}
                  >
                    {saved.includes(selected.id) ? (
                      <BookmarkCheck size={18} />
                    ) : (
                      <Bookmark size={18} />
                    )}{" "}
                    {saved.includes(selected.id)
                      ? "Saved to watchlist"
                      : "Save idea"}
                  </button>
                  <span className="pill">{selected.category}</span>
                  <span className="pill">{selected.format}</span>
                </div>
              </div>
              <div className="detailGrid">
                <section className="panel">
                  <div className="sectionTitle">
                    <h2>Illustrative interest trend</h2>
                    <span className="tag">DEMO SERIES</span>
                  </div>
                  <Trend values={selected.momentum} large />
                  <p className="muted">
                    Synthetic chart values for interface demonstration only; not
                    measured search volume or view counts.
                  </p>
                </section>
                <section className="panel">
                  <h2>Opportunity breakdown</h2>
                  <div className="bigScore">
                    {selected.score}
                    <small>/100</small>
                  </div>
                  <p className="muted">
                    Sample opportunity score — not a validated prediction.
                  </p>
                  <div className="detailLine">
                    Competition <strong>{selected.competition} · Demo</strong>
                  </div>
                  <div className="detailLine">
                    Content format <strong>{selected.format}</strong>
                  </div>
                  <h3>Suggested creative angle</h3>
                  <p>{selected.angle}</p>
                  <h3>Keywords to explore</h3>
                  <div className="chips">
                    {selected.keywords.map((k) => (
                      <span className="pill" key={k}>
                        {k}
                      </span>
                    ))}
                  </div>
                </section>
              </div>
              <ResearchWorkspace
                key={selected.id}
                topic={selected}
                value={research[selected.id]}
                storageFailed={researchFailed}
                onChange={(value) =>
                  setResearch((old) => ({ ...old, [selected.id]: value }))
                }
              />
            </>
          ) : (
            <>
              <div className="heading">
                <div>
                  <div className="eyebrow">
                    <span className="redDot" /> CREATOR INTELLIGENCE PLATFORM
                  </div>
                  <h1>
                    {page === "saved"
                      ? "Your watchlist"
                      : page === "discover"
                        ? "Discover opportunities"
                        : "Find your next big idea."}
                  </h1>
                  <p>
                    {page === "saved"
                      ? "Keep promising topics in one place. Saved locally in this browser."
                      : page === "discover"
                        ? "Explore creative directions with transparent sample signals."
                        : "Spot content opportunities before you start creating."}
                  </p>
                </div>
                <button
                  className="primary"
                  onClick={() => navigate("discover")}
                >
                  <Compass size={17} /> Explore ideas <ArrowRight size={17} />
                </button>
              </div>
              {page === "home" && (
                <>
                  <div className="hero">
                    <div className="heroGlow" />
                    <div className="heroText">
                      <span className="heroTag">
                        <Sparkles size={14} /> THE CREATOR EDGE
                      </span>
                      <h2>
                        Stop guessing.
                        <br />
                        <em>Start discovering.</em>
                      </h2>
                      <p>
                        Explore curated video concepts, compare illustrative
                        opportunity signals, and build your next content plan.
                      </p>
                      <button
                        className="heroButton"
                        onClick={() => navigate("discover")}
                      >
                        Explore opportunities <ArrowRight size={17} />
                      </button>
                    </div>
                    <div className="heroVisual">
                      <div className="orb">
                        <Activity size={75} strokeWidth={1.3} />
                      </div>
                      <div className="floatingLabel">
                        SIGNAL <span> / DISCOVER</span>
                      </div>
                    </div>
                  </div>
                  <div className="stats">
                    <div className="stat">
                      <span>DEMO TOPICS</span>
                      <strong>
                        {topics.length.toString().padStart(2, "0")}
                      </strong>
                      <small>Curated examples</small>
                    </div>
                    <div className="stat">
                      <span>SAVED IDEAS</span>
                      <strong>
                        {saved.length.toString().padStart(2, "0")}
                      </strong>
                      <small>In your watchlist</small>
                    </div>
                    <div className="stat">
                      <span>CONTENT FORMATS</span>
                      <strong>02</strong>
                      <small>Shorts & long-form</small>
                    </div>
                    <div className="stat">
                      <span>DATA STATUS</span>
                      <strong className="statusText">DEMO</strong>
                      <small>No live API connected</small>
                    </div>
                  </div>
                </>
              )}
              <section className="opportunities">
                <div className="sectionTitle">
                  <div>
                    <div className="eyebrow">OPPORTUNITY RADAR</div>
                    <h2>
                      {page === "saved"
                        ? "Saved opportunities"
                        : "Explore video concepts"}{" "}
                      <span className="muted">(demo)</span>
                    </h2>
                  </div>
                  <span className="tag">
                    <Flame size={14} /> SAMPLE DATA
                  </span>
                </div>
                <div className="filters">
                  <label className="search">
                    <Search size={19} />
                    <input
                      aria-label="Search topics"
                      placeholder="Search topics, niches, keywords..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </label>
                  <select
                    aria-label="Filter category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <select
                    aria-label="Filter format"
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                  >
                    {formats.map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </select>
                  <select
                    aria-label="Sort ideas"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="score">Demo score</option>
                    <option value="competition">Demo competition</option>
                    <option value="title">Title A–Z</option>
                  </select>
                </div>
                <div className="resultsHeader" aria-live="polite">
                  <span>{visible.length} opportunities found</span>
                  <button
                    className="clearFilters"
                    onClick={clearFilters}
                    disabled={!query && category === "All" && format === "All"}
                  >
                    Clear filters
                  </button>
                </div>
                <div className="cards">
                  {visible.map((t) => (
                    <article className="topicCard" key={t.id}>
                      <div className="cardTop">
                        <span className="category">
                          {t.category} · {t.format}
                        </span>
                        <button
                          className="saveBtn"
                          aria-label={`${saved.includes(t.id) ? "Remove saved idea" : "Save idea"}: ${t.title}`}
                          aria-pressed={saved.includes(t.id)}
                          onClick={() => toggle(t.id)}
                        >
                          {saved.includes(t.id) ? (
                            <BookmarkCheck size={19} />
                          ) : (
                            <Bookmark size={19} />
                          )}
                        </button>
                      </div>
                      <h3>{t.title}</h3>
                      {research[t.id] && (
                        <span className="stageBadge">
                          {research[t.id].stage}
                        </span>
                      )}
                      <p>{t.description}</p>
                      <Trend values={t.momentum} />
                      <div className="cardMetrics">
                        <div>
                          <span>DEMO SCORE</span>
                          <strong>
                            {t.score}
                            <small>/100</small>
                          </strong>
                        </div>
                        <div>
                          <span>COMPETITION</span>
                          <strong className="competition">
                            {t.competition}
                          </strong>
                        </div>
                      </div>
                      <button
                        className="detailsBtn"
                        onClick={() => openTopic(t)}
                      >
                        Explore topic <ArrowRight size={16} />
                      </button>
                    </article>
                  ))}
                </div>
                {!visible.length && (
                  <div className="empty">
                    <Bookmark size={28} />
                    <h3>No ideas found</h3>
                    <p>
                      {page === "saved" && !saved.length
                        ? "Save a topic from Discover to start your watchlist."
                        : "No ideas match these filters. Try another search or clear your filters."}
                    </p>
                    <button
                      className="primary"
                      onClick={() => {
                        clearFilters();
                        if (page === "saved" && !saved.length)
                          navigate("discover");
                      }}
                    >
                      {" "}
                      {page === "saved" && !saved.length
                        ? "Browse opportunities"
                        : "Clear filters"}
                    </button>
                  </div>
                )}
              </section>
            </>
          )}
          <footer>
            © SIGNAL · Creator Intelligence{" "}
            <span>Demo data only · No live analytics or predictive claims</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
