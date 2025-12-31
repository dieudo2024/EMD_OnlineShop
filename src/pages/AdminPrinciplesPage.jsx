import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { sanitizeString } from "../utils/security";

const principles = [
  {
    title: "Modularity",
    status: "Healthy",
    description:
      "Componentized UI, dedicated contexts (cart, reviews, catalog) and shared sanitizers keep concerns separated.",
    evidence: [
      "ProductCatalogProvider centralizes data fetch/cache and normalization.",
      "Cart/Reviews contexts isolate state and storage concerns.",
      "Shared security utils sanitize user input before persistence.",
    ],
    next: "Introduce a small service layer interface to ease swapping APIs or adding auth gates.",
  },
  {
    title: "Scalability",
    status: "Improving",
    description:
      "Server-side paging with cached pages and retrying fetches reduces load; client filters reset pagination.",
    evidence: [
      "fetchAllProducts supports limit/skip; catalog caches pages.",
      "Home page paginates and debounces search input.",
      "API retries with timeout to smooth transient errors.",
    ],
    next: "Push filtering/search to server endpoints and cache per-query pages; add CDN for assets.",
  },
  {
    title: "Reliability",
    status: "Needs attention",
    description:
      "Retries exist, but user-facing fallbacks and structured error surfaces are minimal.",
    evidence: [
      "Timeout + retry in API wrapper.",
      "Basic loading/error UI on product pages.",
    ],
    next: "Add global error boundary, offline cues, and persisted retry queue for writes (e.g., reviews).",
  },
  {
    title: "Performance",
    status: "Improving",
    description:
      "Lazy images and deferred search reduce main-thread spikes; paging limits payloads.",
    evidence: [
      "<img loading=\"lazy\"> on product cards.",
      "useDeferredValue for search filtering.",
      "Server paging avoids full-list downloads.",
    ],
    next: "Profile memoization hotspots, add list virtualization, and consider web worker for heavy filters.",
  },
  {
    title: "Observability",
    status: "Needs attention",
    description:
      "No telemetry, structured logs, or tracing are emitted.",
    evidence: ["No analytics or log pipeline configured."],
    next: "Add client metrics (LCP, errors), console-safe structured logs, and a minimal trace ID per request.",
  },
  {
    title: "Security",
    status: "Improving",
    description:
      "Inputs are sanitized and ratings clamped; storage guarded against control chars.",
    evidence: [
      "sanitizeString/sanitizeReviewPayload used on forms and storage paths.",
      "Checkout fields normalized before persistence.",
    ],
    next: "Add auth/role gate for admin routes and CSP/helmet config at deploy layer; validate API responses.",
  },
  {
    title: "Maintainability",
    status: "Improving",
    description:
      "Context separation and initial tests exist; but typing and broader coverage are pending.",
    evidence: [
      "Vitest + RTL coverage for catalog normalization/cache.",
      "Dedicated utils and providers reduce duplication.",
    ],
    next: "Add TS or JSDoc types, expand tests to cart/checkout flows, and document API contracts.",
  },
  {
    title: "Cost Awareness",
    status: "Needs attention",
    description:
      "No quota awareness or API budget controls; entirely client-side against third-party API.",
    evidence: ["No rate limiting or usage telemetry is enforced."],
    next: "Track API call counts, cache per-query searches, and add feature flags to shed load if quotas near limits.",
  },
];

function StatusBadge({ status }) {
  const tone = {
    Healthy: "badge-success",
    Improving: "badge-warn",
    "Needs attention": "badge-danger",
  }[status] || "badge-neutral";

  return <span className={`badge ${tone}`}>{status}</span>;
}

function AdminPrinciplesPage() {
  const { isAuthed, login, logout } = useAdminAuth();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const ok = login(sanitizeString(passcode, { maxLength: 128 }));
    if (!ok) {
      setError("Invalid passcode");
    } else {
      setError("");
      setPasscode("");
    }
  };

  const handleLogout = () => {
    logout();
    setPasscode("");
    setError("");
  };

  return (
    <section className="page">
      <div className="admin-header">
        <div>
          <h1>Architecture Principles</h1>
          <p className="muted">
            Quick snapshot of where the app stands and the next concrete steps per principle.
          </p>
        </div>
        <div className="admin-actions">
          {isAuthed ? (
            <button className="btn" onClick={handleLogout}>
              Logout
            </button>
          ) : null}
          <Link to="/" className="btn">
            ← Back to store
          </Link>
        </div>
      </div>
      {!isAuthed ? (
        <form className="admin-login" onSubmit={handleLogin}>
          <label className="eyebrow" htmlFor="admin-passcode">Admin Passcode</label>
          <input
            id="admin-passcode"
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Enter passcode"
          />
          {error && <p className="error-text">{error}</p>}
          <button className="btn primary" type="submit">Sign in</button>
        </form>
      ) : (
        <div className="principles-grid">
          {principles.map((item) => (
            <article key={item.title} className="principle-card">
              <header className="principle-card__header">
                <div>
                  <p className="eyebrow">Principle</p>
                  <h2>{item.title}</h2>
                </div>
                <StatusBadge status={item.status} />
              </header>

              <p className="muted">{item.description}</p>

              <div className="principle-section">
                <p className="eyebrow">Evidence</p>
                <ul>
                  {item.evidence.map((ev) => (
                    <li key={ev}>{ev}</li>
                  ))}
                </ul>
              </div>

              <div className="principle-section">
                <p className="eyebrow">Next</p>
                <p>{item.next}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminPrinciplesPage;
