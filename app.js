"use strict";

const DEMO_SOURCE = "DEMO_FIXTURE";
const READ_ONLY_BOUNDARY = "NO_EXECUTION_PATH";
const FUTURE_POSITIVE_DECISION = "RISK_ACCEPTABLE_NOT_EXECUTION_AUTHORIZED";

const STATUS_CLASS = Object.freeze({
  ANALYZED: "analyzed",
  WATCHLIST: "watch",
  RISK_BLOCKED: "blocked",
  OPEN_MANUAL: "open",
  CLOSED: "closed",
  DRAFT: "draft",
  BOUNDARY: "boundary",
});

const SYSTEM_STATE_CLASS = Object.freeze({
  HEALTHY: "healthy",
  BLOCKED: "blocked",
  ABSENT: "absent",
  PREVIEW: "preview",
  OFFLINE: "offline",
});

const RECONCILIATION_CLASS = Object.freeze({
  OPERATOR_REPORTED: "operator",
  UNKNOWN: "unknown",
  NOT_APPLICABLE: "na",
});

const RECOMMENDATION_FILTER_CLASS = Object.freeze({
  ALL: "all",
  WATCHLIST: "watch",
  ANALYZED: "analyzed",
  RISK_BLOCKED: "blocked",
});

const VIEW_COPY = Object.freeze({
  overview: Object.freeze({
    eyebrow: "Workspace overview",
    title: "Trading workspace",
    subtitle: "Account state, active recommendations, and system status in one controlled surface.",
  }),
  recommendations: Object.freeze({
    eyebrow: "Decision support",
    title: "Recommendations",
    subtitle: "Every material change creates a new version. Analysis never overrides a safety block.",
  }),
  trades: Object.freeze({
    eyebrow: "Manual records",
    title: "Manual trades",
    subtitle: "Operator-reported records. No trade in this preview is broker-confirmed or reconciled.",
  }),
  journal: Object.freeze({
    eyebrow: "Review and learning",
    title: "Journal",
    subtitle: "Operator notes remain editable opinion. Safety facts stay immutable and separate.",
  }),
  system: Object.freeze({
    eyebrow: "Fail-closed posture",
    title: "System status",
    subtitle: "Unavailable dependencies remain blocked instead of being replaced with simulated trust.",
  }),
});

const demoState = Object.freeze({
  source: DEMO_SOURCE,
  fixtureTimeUtc: "2026-07-31T01:00:00Z",
  boundary: READ_ONLY_BOUNDARY,
  activeDecision: "PAPER_EVIDENCE_MODE_NOT_IMPLEMENTED",
  futurePositiveDecision: FUTURE_POSITIVE_DECISION,
  account: Object.freeze({
    id: "DEMO_ACCOUNT_001",
    currentEquity: "101240",
    dailyHeadroom: "5240",
    dailyLimit: "5000",
    overallHeadroom: "11240",
    overallLimit: "10000",
  }),
  recommendations: Object.freeze([
    Object.freeze({
      id: "REC-DEMO-1042-V3",
      mark: "EU",
      symbol: "EURUSD",
      side: "LONG",
      setup: "London continuation",
      status: "ANALYZED",
      entry: "1.08342",
      stop: "1.07992",
      target: "1.09042",
      source: "DEMO_FIXTURE",
      risk: "NOT_EVALUATED",
      validity: "10 minutes",
      thesis: "Fake momentum continuation above a simulated intraday level.",
      counter: "Fixture liquidity is unverified and the safety path is intentionally blocked.",
    }),
    Object.freeze({
      id: "REC-DEMO-1077-V1",
      mark: "XU",
      symbol: "XAUUSD",
      side: "SHORT",
      setup: "Failed breakout",
      status: "RISK_BLOCKED",
      entry: "2388.40",
      stop: "2396.10",
      target: "2373.00",
      source: "DEMO_FIXTURE",
      risk: "PAPER_EVIDENCE_MODE_NOT_IMPLEMENTED",
      validity: "Expired",
      thesis: "Fake rejection from a simulated resistance zone.",
      counter: "The source is not authenticated MT5 evidence and cannot support a positive result.",
    }),
    Object.freeze({
      id: "REC-DEMO-1091-V2",
      mark: "NU",
      symbol: "NAS100",
      side: "LONG",
      setup: "Opening range watch",
      status: "WATCHLIST",
      entry: "18842.0",
      stop: "18766.0",
      target: "18994.0",
      source: "DEMO_FIXTURE",
      risk: "NOT_REQUESTED",
      validity: "28 minutes",
      thesis: "Fake continuation candidate if the simulated opening range holds.",
      counter: "Volatility and symbol specification are display fixtures only.",
    }),
  ]),
  trades: Object.freeze([
    Object.freeze({ symbol: "EURUSD", side: "LONG", entry: "1.08115", result: "+1.8R", status: "CLOSED", reconciliation: "OPERATOR_REPORTED" }),
    Object.freeze({ symbol: "GBPUSD", side: "SHORT", entry: "1.27640", result: "+0.4R", status: "OPEN_MANUAL", reconciliation: "UNKNOWN" }),
    Object.freeze({ symbol: "NAS100", side: "LONG", entry: "18821.0", result: "—", status: "DRAFT", reconciliation: "NOT_APPLICABLE" }),
    Object.freeze({ symbol: "XAUUSD", side: "SHORT", entry: "2391.80", result: "-1.0R", status: "CLOSED", reconciliation: "OPERATOR_REPORTED" }),
  ]),
  journal: Object.freeze([
    Object.freeze({
      time: "31 JUL · 01:06Z",
      title: "Waited for confirmation",
      note: "Did not chase the first fake EURUSD impulse. Entry plan remained unchanged.",
      fact: "Risk decision remained BLOCK. No order was created.",
      tags: Object.freeze(["discipline", "entry-plan"]),
    }),
    Object.freeze({
      time: "30 JUL · 18:44Z",
      title: "Stopped after the block",
      note: "Risk state stayed blocked. No attempt was made to relabel fixture data as authenticated.",
      fact: "Safety Gateway status: BLOCKED. Prerequisite B1-PRE-01 not implemented.",
      tags: Object.freeze(["safety", "process"]),
    }),
    Object.freeze({
      time: "30 JUL · 15:20Z",
      title: "Late exit review",
      note: "Operator-reported close was later than the written plan. Add a clearer invalidation note next time.",
      fact: "Trade record reconciliation: OPERATOR_REPORTED. Not broker-verified.",
      tags: Object.freeze(["exit", "mistake"]),
    }),
    Object.freeze({
      time: "29 JUL · 11:10Z",
      title: "Good no-trade decision",
      note: "Skipped an unverified setup when the simulated source facts contradicted each other.",
      fact: "Recommendation source: DEMO_FIXTURE. No authenticated MT5 provenance existed.",
      tags: Object.freeze(["no-trade", "data-quality"]),
    }),
  ]),
  pipeline: Object.freeze([
    Object.freeze({ state: "DONE", title: "B1 architecture", detail: "B1-01 through B1-07 merged." }),
    Object.freeze({ state: "CURRENT", title: "App shell preview", detail: "Public read-only interface available." }),
    Object.freeze({ state: "PENDING", title: "B1-PRE-01", detail: "Explicit PAPER evidence mode requires independent safety review." }),
    Object.freeze({ state: "PENDING", title: "Backend implementation", detail: "API, database, auth, and gateway remain separate PRs." }),
  ]),
  systems: Object.freeze([
    Object.freeze({
      label: "Public app shell",
      detail: "Static browser-only preview with fake records.",
      state: "PREVIEW",
      dependency: "None",
      blocker: "None",
      next: "N/A",
    }),
    Object.freeze({
      label: "B1 specifications",
      detail: "Architecture sequence B1-01 through B1-07 merged.",
      state: "HEALTHY",
      dependency: "None",
      blocker: "None",
      next: "N/A",
    }),
    Object.freeze({
      label: "Safety Gateway",
      detail: "No runtime connection in the public preview.",
      state: "BLOCKED",
      dependency: "Risk Vault, backend deployment",
      blocker: "B1-PRE-01 not implemented",
      next: "Independent safety review of PAPER evidence mode",
    }),
    Object.freeze({
      label: "PAPER evidence mode",
      detail: "B1-PRE-01 is not implemented.",
      state: "BLOCKED",
      dependency: "Reviewed evidence specification",
      blocker: "B1-PRE-01 not implemented",
      next: "Author and review B1-PRE-01",
    }),
    Object.freeze({
      label: "MT5 provenance",
      detail: "No live or authenticated MT5 source exists.",
      state: "OFFLINE",
      dependency: "Authenticated MT5 bridge",
      blocker: "No authenticated MT5 provenance",
      next: "Define and review MT5 authentication path",
    }),
    Object.freeze({
      label: "Broker execution",
      detail: "No order module, endpoint, or network path exists — no broker connection.",
      state: "ABSENT",
      dependency: "Out of scope for B1",
      blocker: "no broker connection",
      next: "Not scheduled",
    }),
  ]),
});

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = String(value);
  }
}

function createTextElement(tagName, className, value) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  element.textContent = String(value);
  return element;
}

function mappedClass(map, key, label) {
  const className = map[key];
  if (typeof className !== "string") {
    throw new Error(`unknown ${label}`);
  }
  return className;
}

function formatCurrency(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error("invalid display-only currency value");
  }
  return currency.format(parsed);
}

function createStatusPill(status) {
  const suffix = mappedClass(STATUS_CLASS, status, "status class");
  return createTextElement("span", `status-pill status-${suffix}`, status);
}

function createReconciliationPill(reconciliation) {
  const suffix = mappedClass(RECONCILIATION_CLASS, reconciliation, "reconciliation class");
  return createTextElement("span", `reconciliation-pill reconciliation-${suffix}`, reconciliation);
}

function recommendationCopy(recommendation) {
  const copy = document.createElement("div");
  copy.className = "recommendation-copy";
  copy.appendChild(createTextElement("strong", "", `${recommendation.symbol} · ${recommendation.side}`));
  copy.appendChild(createTextElement("span", "", recommendation.setup));
  return copy;
}

function renderOverview() {
  setText("fixture-source", demoState.source);
  setText("fixture-time", demoState.fixtureTimeUtc);
  setText("account-id", demoState.account.id);
  setText("metric-equity", formatCurrency(demoState.account.currentEquity));
  setText("metric-daily", formatCurrency(demoState.account.dailyHeadroom));
  setText("metric-overall", formatCurrency(demoState.account.overallHeadroom));
  setText("metric-open-trades", demoState.trades.filter((trade) => trade.status === "OPEN_MANUAL").length);
  setText("metric-recommendations", demoState.recommendations.length);
  setText("active-decision", demoState.activeDecision);
  setText("future-positive-label", demoState.futurePositiveDecision);

  const dailyReference = demoState.account.dailyLimit;
  const overallReference = demoState.account.overallLimit;
  if (!dailyReference || !overallReference) {
    throw new Error("demo account limits are required");
  }
  setText("metric-daily-limit", formatCurrency(dailyReference));
  setText("metric-overall-limit", formatCurrency(overallReference));

  const container = document.getElementById("overview-recommendations");
  if (container) {
    for (const recommendation of demoState.recommendations) {
      const row = document.createElement("div");
      row.className = "overview-rec-row";
      row.appendChild(createTextElement("span", "overview-rec-symbol", recommendation.symbol));
      row.appendChild(createTextElement("span", "overview-rec-side", recommendation.side));
      row.appendChild(createTextElement("span", "overview-rec-setup", recommendation.setup));
      row.appendChild(createStatusPill(recommendation.status));
      container.appendChild(row);
    }
  }
}

function renderPipeline() {
  const container = document.getElementById("pipeline-list");
  if (!container) {
    return;
  }

  const stateClass = Object.freeze({
    DONE: "pipeline-done",
    CURRENT: "pipeline-current",
    PENDING: "pipeline-pending",
  });

  for (const step of demoState.pipeline) {
    const item = document.createElement("li");
    item.className = "pipeline-row";
    const marker = createTextElement("span", `pipeline-marker ${mappedClass(stateClass, step.state, "pipeline state")}`, step.state);
    const copy = document.createElement("div");
    copy.className = "pipeline-copy";
    copy.appendChild(createTextElement("strong", "", step.title));
    copy.appendChild(createTextElement("span", "", step.detail));
    item.appendChild(marker);
    item.appendChild(copy);
    container.appendChild(item);
  }
}

function selectRecommendation(recommendationId) {
  const recommendation = demoState.recommendations.find((item) => item.id === recommendationId);
  if (!recommendation) {
    throw new Error("unknown recommendation");
  }

  setText("detail-symbol-mark", recommendation.mark);
  setText("detail-symbol", recommendation.symbol);
  setText("detail-meta", `${recommendation.side} · ${recommendation.setup}`);
  setText("detail-entry", recommendation.entry);
  setText("detail-stop", recommendation.stop);
  setText("detail-target", recommendation.target);
  setText("detail-status", recommendation.status);
  setText("detail-source", recommendation.source);
  setText("detail-risk", recommendation.risk);
  setText("detail-validity", recommendation.validity);
  setText("detail-thesis", recommendation.thesis);
  setText("detail-counter", recommendation.counter);

  const rows = document.querySelectorAll("[data-recommendation-id]");
  for (const row of rows) {
    row.className = row.dataset.recommendationId === recommendationId ? "recommendation-row selected" : "recommendation-row";
  }
}

function applyRecommendationFilter(filter) {
  const rows = document.querySelectorAll("[data-recommendation-id]");
  for (const row of rows) {
    const status = row.dataset.recommendationStatus;
    row.hidden = filter !== "ALL" && status !== filter;
  }

  const tabs = document.querySelectorAll("[data-recommendation-filter]");
  for (const tab of tabs) {
    tab.className = tab.dataset.recommendationFilter === filter ? "filter-tab active" : "filter-tab";
    tab.setAttribute("aria-selected", tab.dataset.recommendationFilter === filter ? "true" : "false");
  }
}

function renderRecommendations() {
  const container = document.getElementById("recommendation-list");
  if (!container) {
    return;
  }

  for (const recommendation of demoState.recommendations) {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "recommendation-row";
    row.dataset.recommendationId = recommendation.id;
    row.dataset.recommendationStatus = recommendation.status;
    row.appendChild(createTextElement("div", "symbol-mark", recommendation.mark));
    row.appendChild(recommendationCopy(recommendation));
    row.appendChild(createStatusPill(recommendation.status));
    row.addEventListener("click", () => selectRecommendation(recommendation.id));
    container.appendChild(row);
  }

  const filterTabs = document.querySelectorAll("[data-recommendation-filter]");
  for (const tab of filterTabs) {
    tab.addEventListener("click", () => applyRecommendationFilter(tab.dataset.recommendationFilter));
  }

  selectRecommendation(demoState.recommendations[0].id);
  applyRecommendationFilter("ALL");
}

function renderTrades() {
  const body = document.getElementById("trade-table-body");
  if (!body) {
    return;
  }

  for (const trade of demoState.trades) {
    const row = document.createElement("tr");
    row.appendChild(createTextElement("td", "cell-symbol", trade.symbol));
    row.appendChild(createTextElement("td", "", trade.side));
    row.appendChild(createTextElement("td", "cell-numeric", trade.entry));
    row.appendChild(createTextElement("td", "cell-numeric", trade.result));
    const statusCell = document.createElement("td");
    statusCell.appendChild(createStatusPill(trade.status));
    row.appendChild(statusCell);
    const reconciliationCell = document.createElement("td");
    reconciliationCell.appendChild(createReconciliationPill(trade.reconciliation));
    row.appendChild(reconciliationCell);
    const provenanceCell = document.createElement("td");
    provenanceCell.appendChild(createTextElement("span", "provenance-note", "Operator-reported · no broker confirmation"));
    row.appendChild(provenanceCell);
    body.appendChild(row);
  }
}

function renderJournal() {
  const container = document.getElementById("journal-list");
  if (!container) {
    return;
  }

  for (const entry of demoState.journal) {
    const item = document.createElement("li");
    item.className = "journal-item";
    item.appendChild(createTextElement("time", "journal-time", entry.time));

    const copy = document.createElement("div");
    copy.className = "journal-copy";
    copy.appendChild(createTextElement("h3", "", entry.title));

    const noteBlock = document.createElement("div");
    noteBlock.className = "journal-note";
    noteBlock.appendChild(createTextElement("span", "journal-label", "Operator note"));
    noteBlock.appendChild(createTextElement("p", "", entry.note));
    copy.appendChild(noteBlock);

    const factBlock = document.createElement("div");
    factBlock.className = "journal-fact";
    factBlock.appendChild(createTextElement("span", "journal-label", "Safety fact"));
    factBlock.appendChild(createTextElement("p", "", entry.fact));
    copy.appendChild(factBlock);

    const tags = document.createElement("div");
    tags.className = "tag-list";
    for (const tag of entry.tags) {
      tags.appendChild(createTextElement("span", "tag", tag));
    }
    copy.appendChild(tags);
    item.appendChild(copy);
    container.appendChild(item);
  }
}

function renderSystems() {
  const body = document.getElementById("system-table-body");
  if (!body) {
    return;
  }

  for (const system of demoState.systems) {
    const row = document.createElement("tr");
    row.appendChild(createTextElement("td", "cell-symbol", system.label));

    const stateCell = document.createElement("td");
    const stateSuffix = mappedClass(SYSTEM_STATE_CLASS, system.state, "system state class");
    stateCell.appendChild(createTextElement("span", `system-state state-${stateSuffix}`, system.state));
    row.appendChild(stateCell);

    row.appendChild(createTextElement("td", "", system.dependency));
    row.appendChild(createTextElement("td", "", system.blocker));
    row.appendChild(createTextElement("td", "", system.next));
    body.appendChild(row);
  }
}

function activateView(viewName) {
  const copy = VIEW_COPY[viewName];
  if (!copy) {
    throw new Error("unknown view");
  }

  setText("view-eyebrow", copy.eyebrow);
  setText("view-title", copy.title);
  setText("view-subtitle", copy.subtitle);

  const panels = document.querySelectorAll("[data-view-panel]");
  for (const panel of panels) {
    panel.hidden = panel.dataset.viewPanel !== viewName;
  }

  const buttons = document.querySelectorAll("[data-view]");
  for (const button of buttons) {
    button.className = button.dataset.view === viewName ? "nav-button active" : "nav-button";
  }

  document.documentElement.dataset.activeView = viewName;
}

function bindNavigation() {
  const buttons = document.querySelectorAll("[data-view]");
  for (const button of buttons) {
    button.addEventListener("click", () => activateView(button.dataset.view));
  }

  const openButtons = document.querySelectorAll("[data-open-view]");
  for (const button of openButtons) {
    button.addEventListener("click", () => activateView(button.dataset.openView));
  }
}

function initializeDemo() {
  document.documentElement.dataset.demoSource = DEMO_SOURCE;
  document.documentElement.dataset.readOnlyBoundary = READ_ONLY_BOUNDARY;
  renderOverview();
  renderPipeline();
  renderRecommendations();
  renderTrades();
  renderJournal();
  renderSystems();
  bindNavigation();
  activateView("overview");
}

initializeDemo();
