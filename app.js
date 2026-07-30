"use strict";

const DEMO_SOURCE = "DEMO_FIXTURE";
const READ_ONLY_BOUNDARY = "NO_EXECUTION_PATH";

const demoState = Object.freeze({
  source: DEMO_SOURCE,
  fixtureTimeUtc: "2026-07-30T16:30:00Z",
  mode: "READ_ONLY_DEMO",
  account: Object.freeze({
    id: "DEMO_ACCOUNT_001",
    program: "FTMO 2-Step — Simulation",
    currentEquity: 101240,
    dailyHeadroom: 5240,
    overallHeadroom: 11240,
  }),
  risk: Object.freeze({
    currentOpenRisk: 310,
    proposedStopRisk: 420,
    aggregateRisk: 730,
    aggregateLimit: 1000,
    expectedCosts: 18,
    riskUtilizationPercent: 73,
  }),
  proposal: Object.freeze({
    id: "DEMO_PROPOSAL_1042",
    symbol: "EURUSD",
    side: "LONG",
    entry: 1.08342,
    stop: 1.07992,
    takeProfit: 1.09042,
    volume: 1.2,
    expectedStopLoss: 420,
    riskReward: 2.0,
    validUntilUtc: "2026-07-30T16:40:00Z",
  }),
  decision: Object.freeze({
    value: "RISK_ACCEPTABLE_NOT_EXECUTION_AUTHORIZED",
    policy: "ftmo-2step-reference / 2026-07-29.2",
    decisionHash: "4d16…b9f2",
  }),
  checks: Object.freeze([
    Object.freeze({ name: "Input validation", actual: "Canonical and bounded", limit: "Strict schema", status: "OK" }),
    Object.freeze({ name: "Account / policy binding", actual: "Exact fixture match", limit: "Exact match", status: "OK" }),
    Object.freeze({ name: "Policy content binding", actual: "Canonical hash bound", limit: "Signed content", status: "OK" }),
    Object.freeze({ name: "Specification freshness", actual: "10 seconds", limit: "≤ 300 seconds", status: "OK" }),
    Object.freeze({ name: "Market snapshot freshness", actual: "5 seconds", limit: "≤ 60 seconds", status: "OK" }),
    Object.freeze({ name: "Position recomputation", actual: "All fields match", limit: "Exact deterministic result", status: "OK" }),
    Object.freeze({ name: "Daily loss boundary", actual: "$101,240", limit: "> $96,000", status: "OK" }),
    Object.freeze({ name: "Overall loss boundary", actual: "$101,240", limit: "> $90,000", status: "OK" }),
    Object.freeze({ name: "Aggregate open risk", actual: "$730", limit: "≤ $1,000", status: "OK" }),
    Object.freeze({ name: "Kill switch", actual: "Inactive", limit: "Must be inactive", status: "OK" }),
    Object.freeze({ name: "Broker execution", actual: "Absent by design", limit: "No browser path", status: "BOUNDARY" }),
  ]),
  systems: Object.freeze([
    Object.freeze({ label: "Risk Vault", detail: "Deterministic checks available", state: "HEALTHY" }),
    Object.freeze({ label: "Policy governance", detail: "Reference policy hash verified", state: "HEALTHY" }),
    Object.freeze({ label: "MT5 connection", detail: "Not connected in demo", state: "OFFLINE" }),
    Object.freeze({ label: "Order execution", detail: "Module intentionally absent", state: "ABSENT" }),
  ]),
  audit: Object.freeze([
    Object.freeze({ time: "16:30:00Z", title: "Fixture loaded", detail: "Static DEMO_FIXTURE data initialized." }),
    Object.freeze({ time: "16:30:00Z", title: "Policy selected", detail: "Reference 2-Step policy displayed for simulation." }),
    Object.freeze({ time: "16:30:01Z", title: "Position recomputed", detail: "Sample result matched the displayed proposal." }),
    Object.freeze({ time: "16:30:01Z", title: "Risk decision rendered", detail: "No authorization or side effect was created." }),
  ]),
});

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const price = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 5,
  maximumFractionDigits: 5,
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

function renderMetrics() {
  setText("metric-equity", currency.format(demoState.account.currentEquity));
  setText("metric-daily", currency.format(demoState.account.dailyHeadroom));
  setText("metric-overall", currency.format(demoState.account.overallHeadroom));
  setText("metric-risk", `${demoState.risk.riskUtilizationPercent}%`);
  setText("account-id", demoState.account.id);
  setText("account-program", demoState.account.program);
  setText("fixture-time", demoState.fixtureTimeUtc);
  setText("fixture-source", demoState.source);
}

function renderRiskBars() {
  const bars = [
    ["daily-risk-bar", demoState.account.dailyHeadroom, 5000],
    ["overall-risk-bar", demoState.account.overallHeadroom, 10000],
    ["aggregate-risk-bar", demoState.risk.aggregateRisk, demoState.risk.aggregateLimit],
  ];

  for (const [id, value, reference] of bars) {
    const element = document.getElementById(id);
    if (!element) {
      continue;
    }
    const percent = Math.max(0, Math.min(100, (value / reference) * 100));
    element.style.width = `${percent}%`;
    element.setAttribute("aria-valuenow", String(Math.round(percent)));
  }

  setText("daily-headroom", currency.format(demoState.account.dailyHeadroom));
  setText("overall-headroom", currency.format(demoState.account.overallHeadroom));
  setText("aggregate-risk", `${currency.format(demoState.risk.aggregateRisk)} / ${currency.format(demoState.risk.aggregateLimit)}`);
  setText("open-risk", currency.format(demoState.risk.currentOpenRisk));
  setText("proposal-risk", currency.format(demoState.risk.proposedStopRisk));
  setText("expected-costs", currency.format(demoState.risk.expectedCosts));
}

function renderProposal() {
  setText("proposal-id", demoState.proposal.id);
  setText("proposal-symbol", demoState.proposal.symbol);
  setText("proposal-side", demoState.proposal.side);
  setText("proposal-entry", price.format(demoState.proposal.entry));
  setText("proposal-stop", price.format(demoState.proposal.stop));
  setText("proposal-target", price.format(demoState.proposal.takeProfit));
  setText("proposal-volume", `${demoState.proposal.volume.toFixed(2)} lots`);
  setText("proposal-loss", currency.format(demoState.proposal.expectedStopLoss));
  setText("proposal-rr", `${demoState.proposal.riskReward.toFixed(1)}R`);
  setText("proposal-valid-until", demoState.proposal.validUntilUtc);
  setText("decision-value", demoState.decision.value);
  setText("decision-policy", demoState.decision.policy);
  setText("decision-hash", demoState.decision.decisionHash);
}

function renderChecks() {
  const body = document.getElementById("check-table-body");
  if (!body) {
    return;
  }

  for (const check of demoState.checks) {
    const row = document.createElement("tr");
    row.appendChild(createTextElement("td", "check-name", check.name));
    row.appendChild(createTextElement("td", "check-actual", check.actual));
    row.appendChild(createTextElement("td", "check-limit", check.limit));

    const statusCell = document.createElement("td");
    const styleSuffix = check.status === "OK" ? "pass" : check.status.toLowerCase();
    statusCell.appendChild(createTextElement("span", `status-pill status-${styleSuffix}`, check.status));
    row.appendChild(statusCell);
    body.appendChild(row);
  }
}

function renderSystems() {
  const container = document.getElementById("system-grid");
  if (!container) {
    return;
  }

  for (const system of demoState.systems) {
    const card = document.createElement("article");
    card.className = "system-card";

    const header = document.createElement("div");
    header.className = "system-card-header";
    header.appendChild(createTextElement("h3", "system-title", system.label));
    header.appendChild(createTextElement("span", `system-state state-${system.state.toLowerCase()}`, system.state));

    card.appendChild(header);
    card.appendChild(createTextElement("p", "system-detail", system.detail));
    container.appendChild(card);
  }
}

function renderAudit() {
  const container = document.getElementById("audit-list");
  if (!container) {
    return;
  }

  for (const event of demoState.audit) {
    const item = document.createElement("li");
    item.className = "audit-item";
    item.appendChild(createTextElement("time", "audit-time", event.time));

    const copy = document.createElement("div");
    copy.appendChild(createTextElement("h3", "audit-title", event.title));
    copy.appendChild(createTextElement("p", "audit-detail", event.detail));
    item.appendChild(copy);
    container.appendChild(item);
  }
}

function initializeDemo() {
  document.documentElement.dataset.demoSource = DEMO_SOURCE;
  document.documentElement.dataset.readOnlyBoundary = READ_ONLY_BOUNDARY;
  renderMetrics();
  renderRiskBars();
  renderProposal();
  renderChecks();
  renderSystems();
  renderAudit();
}

initializeDemo();
