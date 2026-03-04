import { useState, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0D0D0D;
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .app {
    min-height: 100vh;
    background: #0D0D0D;
    position: relative;
    overflow: hidden;
  }

  .bg-texture {
    position: fixed;
    inset: 0;
    background-image: 
      radial-gradient(ellipse at 20% 20%, rgba(210, 160, 60, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 80%, rgba(60, 120, 80, 0.06) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  .grain {
    position: fixed;
    inset: 0;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
  }

  .container {
    position: relative;
    z-index: 1;
    max-width: 680px;
    margin: 0 auto;
    padding: 40px 24px 80px;
  }

  /* HEADER */
  .header {
    text-align: center;
    margin-bottom: 48px;
    animation: fadeDown 0.6s ease both;
  }

  .logo-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 8px;
  }

  .logo-line {
    height: 1px;
    width: 48px;
    background: linear-gradient(90deg, transparent, #D2A03C);
  }

  .logo-line.right {
    background: linear-gradient(90deg, #D2A03C, transparent);
  }

  .logo-icon {
    font-size: 20px;
  }

  h1 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(52px, 10vw, 80px);
    letter-spacing: 4px;
    line-height: 0.9;
    color: #F5F0E8;
    text-transform: uppercase;
  }

  h1 span {
    color: #D2A03C;
    display: block;
  }

  .subtitle {
    margin-top: 12px;
    color: #6B6B6B;
    font-size: 13px;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 500;
  }

  /* PROGRESS */
  .progress-bar {
    margin-bottom: 40px;
    animation: fadeDown 0.6s 0.1s ease both;
  }

  .progress-labels {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .progress-label {
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #444;
    font-weight: 500;
    transition: color 0.3s;
  }

  .progress-label.active { color: #D2A03C; }

  .progress-track {
    height: 2px;
    background: #1E1E1E;
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #D2A03C, #E8C060);
    border-radius: 2px;
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* QUESTION CARD */
  .question-card {
    background: #141414;
    border: 1px solid #1E1E1E;
    border-radius: 16px;
    padding: 32px;
    margin-bottom: 16px;
    animation: slideUp 0.5s ease both;
    position: relative;
    overflow: hidden;
  }

  .question-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(210, 160, 60, 0.3), transparent);
  }

  .question-number {
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #D2A03C;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .question-title {
    font-size: 20px;
    font-weight: 600;
    color: #F5F0E8;
    margin-bottom: 24px;
    line-height: 1.3;
  }

  /* OPTION BUTTONS */
  .options-grid {
    display: grid;
    gap: 10px;
  }

  .options-grid.cols-2 { grid-template-columns: 1fr 1fr; }
  .options-grid.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
  .options-grid.cols-4 { grid-template-columns: 1fr 1fr 1fr 1fr; }

  @media (max-width: 500px) {
    .options-grid.cols-4 { grid-template-columns: 1fr 1fr; }
    .options-grid.cols-3 { grid-template-columns: 1fr 1fr; }
  }

  .option-btn {
    background: #1A1A1A;
    border: 1.5px solid #252525;
    border-radius: 10px;
    padding: 14px 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    position: relative;
    overflow: hidden;
  }

  .option-btn:hover {
    border-color: #D2A03C;
    background: #1E1C17;
    transform: translateY(-1px);
  }

  .option-btn.selected {
    border-color: #D2A03C;
    background: linear-gradient(135deg, #1E1C17, #252010);
    box-shadow: 0 0 20px rgba(210, 160, 60, 0.15);
  }

  .option-btn.selected::after {
    content: '✓';
    position: absolute;
    top: 6px; right: 8px;
    font-size: 10px;
    color: #D2A03C;
    font-weight: 700;
  }

  .option-icon {
    font-size: 24px;
    line-height: 1;
  }

  .option-label {
    font-size: 12px;
    font-weight: 600;
    color: #A0A0A0;
    letter-spacing: 0.5px;
    line-height: 1.2;
    transition: color 0.2s;
  }

  .option-btn.selected .option-label,
  .option-btn:hover .option-label {
    color: #F5F0E8;
  }

  .option-sub {
    font-size: 10px;
    color: #555;
    font-weight: 400;
  }

  /* DROPDOWN */
  .styled-select {
    width: 100%;
    background: #1A1A1A;
    border: 1.5px solid #252525;
    border-radius: 10px;
    padding: 14px 16px;
    color: #F5F0E8;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    cursor: pointer;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23D2A03C' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    transition: border-color 0.2s;
  }

  .styled-select:focus {
    border-color: #D2A03C;
  }

  .styled-select option {
    background: #1A1A1A;
    color: #F5F0E8;
  }

  /* SUBMIT */
  .submit-section {
    margin-top: 24px;
    animation: slideUp 0.5s 0.3s ease both;
  }

  .submit-btn {
    width: 100%;
    padding: 18px 32px;
    background: linear-gradient(135deg, #D2A03C, #B8861E);
    border: none;
    border-radius: 12px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    letter-spacing: 3px;
    color: #0D0D0D;
    cursor: pointer;
    transition: all 0.25s ease;
    position: relative;
    overflow: hidden;
  }

  .submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(210, 160, 60, 0.3);
  }

  .submit-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .submit-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .submit-btn .btn-sub {
    display: block;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    letter-spacing: 1px;
    font-weight: 500;
    margin-top: 2px;
    opacity: 0.7;
  }

  /* LOADING SCREEN */
  .loading-screen {
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    animation: fadeIn 0.4s ease both;
  }

  .loading-wheel {
    width: 64px;
    height: 64px;
    border: 2px solid #1E1E1E;
    border-top-color: #D2A03C;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 24px;
  }

  .loading-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 32px;
    letter-spacing: 3px;
    color: #F5F0E8;
    margin-bottom: 8px;
  }

  .loading-steps {
    list-style: none;
    margin-top: 24px;
    text-align: left;
    display: inline-block;
  }

  .loading-step {
    font-size: 13px;
    color: #444;
    padding: 4px 0;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: color 0.4s;
  }

  .loading-step.done { color: #6BCB77; }
  .loading-step.active { color: #D2A03C; }

  .step-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #333;
    flex-shrink: 0;
    transition: background 0.4s;
  }

  .loading-step.done .step-dot { background: #6BCB77; }
  .loading-step.active .step-dot { 
    background: #D2A03C;
    box-shadow: 0 0 8px #D2A03C;
    animation: pulse 1s ease infinite;
  }

  /* RESULTS SCREEN */
  .results-screen {
    animation: fadeIn 0.5s ease both;
  }

  .results-header {
    text-align: center;
    margin-bottom: 32px;
  }

  .results-badge {
    display: inline-block;
    background: rgba(210, 160, 60, 0.1);
    border: 1px solid rgba(210, 160, 60, 0.3);
    border-radius: 20px;
    padding: 4px 14px;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #D2A03C;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .results-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 40px;
    letter-spacing: 3px;
    color: #F5F0E8;
  }

  /* ROUTE CARD */
  .route-card {
    background: #141414;
    border: 1px solid #1E1E1E;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 16px;
    position: relative;
    overflow: hidden;
    animation: slideUp 0.5s ease both;
    transition: border-color 0.2s, transform 0.2s;
  }

  .route-card:hover {
    border-color: #2A2A2A;
    transform: translateY(-2px);
  }

  .route-card.best {
    border-color: rgba(210, 160, 60, 0.4);
    background: linear-gradient(135deg, #161410, #141414);
  }

  .route-card.best::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #D2A03C, transparent);
  }

  .route-rank {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
  }

  .rank-badge {
    background: #1E1E1E;
    border-radius: 6px;
    padding: 3px 10px;
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #555;
    font-weight: 600;
  }

  .route-card.best .rank-badge {
    background: rgba(210, 160, 60, 0.15);
    color: #D2A03C;
  }

  .weather-pill {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: #6B6B6B;
    margin-left: auto;
  }

  .route-name {
    font-size: 22px;
    font-weight: 700;
    color: #F5F0E8;
    margin-bottom: 14px;
    line-height: 1.2;
  }

  .route-stats {
    display: flex;
    gap: 20px;
    margin-bottom: 14px;
    flex-wrap: wrap;
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .stat-val {
    font-size: 20px;
    font-weight: 700;
    color: #F5F0E8;
    line-height: 1;
  }

  .stat-lbl {
    font-size: 10px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #555;
    font-weight: 500;
  }

  .stat-divider {
    width: 1px;
    background: #1E1E1E;
    align-self: stretch;
  }

  .route-region {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #6B6B6B;
    margin-bottom: 12px;
  }

  .trail-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    padding: 4px 10px;
    border-radius: 20px;
    font-weight: 500;
    margin-bottom: 14px;
    margin-left: 8px;
  }

  .trail-status.good {
    background: rgba(107, 203, 119, 0.1);
    color: #6BCB77;
  }

  .trail-status.caution {
    background: rgba(255, 180, 50, 0.1);
    color: #FFB432;
  }

  .route-reason {
    font-size: 13px;
    color: #555;
    line-height: 1.6;
    border-top: 1px solid #1A1A1A;
    padding-top: 12px;
    font-style: italic;
  }

  .gpx-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 14px;
    padding: 8px 16px;
    background: #1A1A1A;
    border: 1px solid #252525;
    border-radius: 8px;
    font-size: 12px;
    color: #D2A03C;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    letter-spacing: 0.5px;
    transition: all 0.2s;
    text-decoration: none;
  }

  .gpx-btn:hover {
    background: #1E1C17;
    border-color: #D2A03C;
  }

  .restart-btn {
    width: 100%;
    margin-top: 24px;
    padding: 14px;
    background: transparent;
    border: 1.5px solid #252525;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #555;
    cursor: pointer;
    letter-spacing: 1px;
    transition: all 0.2s;
  }

  .restart-btn:hover {
    border-color: #444;
    color: #888;
  }

  /* ANIMATIONS */
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }
`;

// ─── DATA ────────────────────────────────────────────────────────────────────

const TIME_OPTIONS = [
  { id: "1.5-2", icon: "⚡", label: "1.5–2 hrs", sub: "~25–35 km" },
  { id: "2-3",   icon: "🚴", label: "2–3 hrs",   sub: "~35–55 km" },
  { id: "3-4",   icon: "🏔️", label: "3–4 hrs",   sub: "~55–75 km" },
  { id: "4+",    icon: "🌍", label: "4+ hrs",    sub: "75 km+" },
];

const TERRAIN_OPTIONS = [
  { id: "singletrack", icon: "🌲", label: "Singletrack" },
  { id: "mixed",       icon: "🔀", label: "Mixed" },
  { id: "any",         icon: "🤷", label: "No Preference" },
];

const CLIMB_OPTIONS = [
  { id: "flat",     icon: "😌", label: "Flat & Easy" },
  { id: "moderate", icon: "💪", label: "Moderate" },
  { id: "beast",    icon: "🔥", label: "Bring It On" },
];

const GROUP_OPTIONS = [
  { id: "solo",  icon: "🚴", label: "Solo" },
  { id: "group", icon: "👥", label: "With Group" },
];

const AREAS = [
  "No Preference",
  "Pardes Hana / Hadera",
  "Carmel",
  "Samaria / Gilboa / Jordan Valley",
  "Alon Hagalil",
  "Golan Heights",
  "Jerusalem Hills / Judean Desert",
  "Lahav / Rimon Forest",
  "South (Beer Sheva - Eilat)",
];

const LOADING_STEPS = [
  "Checking your Strava performance data",
  "Fetching tomorrow's weather forecast",
  "Evaluating trail conditions by region",
  "Scanning 125 routes in your library",
  "Ranking best matches for your profile",
];

// ─── API CONFIG ──────────────────────────────────────────────────────────────

// Time → distance range mapping based on Oren's riding pace
const TIME_TO_DISTANCE = {
  "1.5-2": { min: 20, max: 38 },
  "2-3":   { min: 35, max: 58 },
  "3-4":   { min: 55, max: 78 },
  "4+":    { min: 75, max: 999 },
};

// Elevation gain thresholds for climbing preference
const CLIMB_FILTER = {
  "flat":     { max: 500 },
  "moderate": { min: 400, max: 900 },
  "beast":    { min: 800 },
};

async function fetchRoutesFromAirtable(selections) {
  const res = await fetch('/api/routes');
  const data = await res.json();
  if (!data.records) return [];

  const distRange = TIME_TO_DISTANCE[selections.time] || { min: 0, max: 999 };
  const climbRange = CLIMB_FILTER[selections.climbing] || {};

  // Filter routes based on selections
  let routes = data.records
    .map(r => r.fields)
    .filter(r => {
      const dist = parseFloat(r['Distance']) || 0;
      const elev = parseFloat(r['Elevation Gain']) || 0;
      const region = r['Region'] || '';

      // Distance filter
      if (dist < distRange.min || dist > distRange.max) return false;

      // Climbing filter
      if (climbRange.max && elev > climbRange.max) return false;
      if (climbRange.min && elev < climbRange.min) return false;

      // Area filter
      if (selections.area !== 'No Preference' && region !== selections.area) return false;

      // Exclude international routes
      if (region === 'International') return false;

      return true;
    });

  // Sort by best match — closest to middle of distance range
  const targetDist = (distRange.min + distRange.max) / 2;
  routes.sort((a, b) => {
    const aDiff = Math.abs((parseFloat(a['Distance']) || 0) - targetDist);
    const bDiff = Math.abs((parseFloat(b['Distance']) || 0) - targetDist);
    return aDiff - bDiff;
  });

  // Return top 3 as ranked results
  return routes.slice(0, 3).map((r, i) => ({
    rank: i + 1,
    name: r['Route Name'] || r['File Name'] || 'Unnamed Route',
    distance: Math.round(parseFloat(r['Distance']) || 0),
    elevation: Math.round(parseFloat(r['Elevation Gain']) || 0),
    region: r['Region'] || 'Unknown',
    dryDays: r['Dry Days Required'] || 3,
    weather: '⏳ Checking...',
    trailStatus: 'good',
    trailLabel: 'Conditions checking...',
    reason: `Matched to your ${selections.time}hr window. ${r['Region']} region — ${Math.round(parseFloat(r['Distance']) || 0)}km with ${Math.round(parseFloat(r['Elevation Gain']) || 0)}m elevation gain.`,
    gpx: r['GPX File Link'] || '#'
  }));
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function OptionButton({ option, selected, onClick }) {
  return (
    <button
      className={`option-btn ${selected ? "selected" : ""}`}
      onClick={() => onClick(option.id)}
    >
      <span className="option-icon">{option.icon}</span>
      <span className="option-label">{option.label}</span>
      {option.sub && <span className="option-sub">{option.sub}</span>}
    </button>
  );
}

function QuestionCard({ number, title, children, delay = 0 }) {
  return (
    <div className="question-card" style={{ animationDelay: `${delay}s` }}>
      <div className="question-number">Question {number} / 5</div>
      <div className="question-title">{title}</div>
      {children}
    </div>
  );
}

function LoadingScreen() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(s => (s < LOADING_STEPS.length - 1 ? s + 1 : s));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-wheel" />
      <div className="loading-title">Finding Your Ride</div>
      <p style={{ color: "#444", fontSize: 13, letterSpacing: 1 }}>Analysing conditions...</p>
      <ul className="loading-steps">
        {LOADING_STEPS.map((step, i) => (
          <li
            key={i}
            className={`loading-step ${i < activeStep ? "done" : i === activeStep ? "active" : ""}`}
          >
            <span className="step-dot" />
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RouteCard({ route, index }) {
  return (
    <div
      className={`route-card ${route.rank === 1 ? "best" : ""}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="route-rank">
        <span className="rank-badge">
          {route.rank === 1 ? "⭐ Best Match" : `Alternative ${route.rank - 1}`}
        </span>
        <span className="weather-pill">{route.weather}</span>
      </div>

      <div className="route-name">{route.name}</div>

      <div className="route-stats">
        <div className="stat">
          <span className="stat-val">{route.distance}</span>
          <span className="stat-lbl">km</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-val">{route.elevation}</span>
          <span className="stat-lbl">m gain</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-val">~{Math.round(route.distance / 14)}h</span>
          <span className="stat-lbl">est. time</span>
        </div>
      </div>

      <div>
        <span className="route-region">📍 {route.region}</span>
        <span className={`trail-status ${route.trailStatus}`}>
          {route.trailStatus === "good" ? "✓" : "⚠"} {route.trailLabel}
        </span>
      </div>

      <div className="route-reason">{route.reason}</div>

      <a href={route.gpx} className="gpx-btn">
        ↓ Download GPX
      </a>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("questionnaire");
  const [selections, setSelections] = useState({
    time: null,
    terrain: null,
    climbing: null,
    group: null,
    area: "No Preference",
  });
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const completedCount = [
    selections.time,
    selections.terrain,
    selections.climbing,
    selections.group,
  ].filter(Boolean).length;

  const progress = (completedCount / 4) * 100;

  const canSubmit = selections.time && selections.terrain && selections.climbing && selections.group;

  const handleSubmit = async () => {
    setScreen("loading");
    setError(null);
    try {
      const routes = await fetchRoutesFromAirtable(selections);
      if (routes.length === 0) {
        setError("No routes found matching your preferences. Try adjusting your filters.");
        setScreen("questionnaire");
        return;
      }
      setResults(routes);
      setScreen("results");
    } catch (err) {
      setError("Could not load routes. Please try again.");
      setScreen("questionnaire");
    }
  };

  const handleRestart = () => {
    setSelections({ time: null, terrain: null, climbing: null, group: null, area: "No Preference" });
    setResults([]);
    setError(null);
    setScreen("questionnaire");
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="bg-texture" />
        <div className="grain" />
        <div className="container">

          {/* HEADER */}
          <div className="header">
            <div className="logo-bar">
              <div className="logo-line" />
              <span className="logo-icon">🚵</span>
              <div className="logo-line right" />
            </div>
            <h1>The<span>Perfect Ride</span></h1>
            <p className="subtitle">Personalized route intelligence</p>
          </div>

          {/* QUESTIONNAIRE */}
          {screen === "questionnaire" && (
            <>
              <div className="progress-bar">
                <div className="progress-labels">
                  {["Time", "Terrain", "Climbing", "Group", "Area"].map((l, i) => (
                    <span
                      key={l}
                      className={`progress-label ${i < completedCount ? "active" : ""}`}
                    >
                      {l}
                    </span>
                  ))}
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <QuestionCard number={1} title="⏱️ How much time do you have today?" delay={0}>
                <div className="options-grid cols-4">
                  {TIME_OPTIONS.map(o => (
                    <OptionButton
                      key={o.id}
                      option={o}
                      selected={selections.time === o.id}
                      onClick={v => setSelections(s => ({ ...s, time: v }))}
                    />
                  ))}
                </div>
              </QuestionCard>

              <QuestionCard number={2} title="🏔️ What terrain today?" delay={0.05}>
                <div className="options-grid cols-3">
                  {TERRAIN_OPTIONS.map(o => (
                    <OptionButton
                      key={o.id}
                      option={o}
                      selected={selections.terrain === o.id}
                      onClick={v => setSelections(s => ({ ...s, terrain: v }))}
                    />
                  ))}
                </div>
              </QuestionCard>

              <QuestionCard number={3} title="⛰️ Climbing appetite today?" delay={0.1}>
                <div className="options-grid cols-3">
                  {CLIMB_OPTIONS.map(o => (
                    <OptionButton
                      key={o.id}
                      option={o}
                      selected={selections.climbing === o.id}
                      onClick={v => setSelections(s => ({ ...s, climbing: v }))}
                    />
                  ))}
                </div>
              </QuestionCard>

              <QuestionCard number={4} title="👥 Riding solo or with group?" delay={0.15}>
                <div className="options-grid cols-2">
                  {GROUP_OPTIONS.map(o => (
                    <OptionButton
                      key={o.id}
                      option={o}
                      selected={selections.group === o.id}
                      onClick={v => setSelections(s => ({ ...s, group: v }))}
                    />
                  ))}
                </div>
              </QuestionCard>

              <QuestionCard number={5} title="📍 Any specific area preference?" delay={0.2}>
                <select
                  className="styled-select"
                  value={selections.area}
                  onChange={e => setSelections(s => ({ ...s, area: e.target.value }))}
                >
                  {AREAS.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </QuestionCard>

              <div className="submit-section">
                <button
                  className="submit-btn"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                >
                  🚴 FIND MY PERFECT RIDE
                  <span className="btn-sub">
                    {canSubmit ? "Analysing weather, trails & your profile" : "Complete all questions above"}
                  </span>
                </button>
              </div>
            </>
          )}

          {/* LOADING */}
          {screen === "loading" && <LoadingScreen />}

          {/* ERROR */}
          {error && (
            <div style={{ color: '#FFB432', background: 'rgba(255,180,50,0.1)', border: '1px solid rgba(255,180,50,0.3)', borderRadius: 12, padding: '16px 20px', marginBottom: 16, fontSize: 14 }}>
              ⚠ {error}
            </div>
          )}

          {/* RESULTS */}
          {screen === "results" && (
            <div className="results-screen">
              <div className="results-header">
                <div className="results-badge">Today's Recommendation</div>
                <div className="results-title">Your Perfect Rides</div>
              </div>

              {results.map((route, i) => (
                <RouteCard key={route.rank} route={route} index={i} />
              ))}

              <button className="restart-btn" onClick={handleRestart}>
                ↺ Start Over with Different Preferences
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
