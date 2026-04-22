import { useEffect, useState } from "react";

const cardStyle = {
  background: "#111827",
  border: "1px solid #1f2937",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
};

const labelStyle = {
  fontSize: "14px",
  color: "#9ca3af",
  marginBottom: "8px",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const valueStyle = {
  fontSize: "15px",
  color: "#e5e7eb",
  lineHeight: "1.6",
  margin: 0,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

function StatusBadge({ ok, text }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 10px",
        borderRadius: "999px",
        fontSize: "13px",
        fontWeight: 600,
        background: ok ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
        color: ok ? "#34d399" : "#f87171",
        border: ok ? "1px solid rgba(52,211,153,0.35)" : "1px solid rgba(248,113,113,0.35)",
      }}
    >
      {text}
    </span>
  );
}

function App() {
  const [rootData, setRootData] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [dbData, setDbData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchJson = async (url) => {
    const res = await fetch(url);
    const text = await res.text();

    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`Non-JSON response from ${url}: ${text.slice(0, 120)}`);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [rootJson, healthJson, dbJson] = await Promise.all([
        fetchJson("/api/"),
        fetchJson("/api/health"),
        fetchJson("/api/db-check"),
      ]);

      setRootData(rootJson);
      setHealthData(healthJson);
      setDbData(dbJson);
    } catch (err) {
      setError(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const dbOk = dbData?.database === "connected";
  const healthOk = healthData?.status === "ok";

  return (
    <div
      style={{
        minHeight: "100vh",
        margin: 0,
        background:
          "linear-gradient(135deg, #0f172a 0%, #111827 45%, #1e293b 100%)",
        color: "#f9fafb",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: "32px 20px",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div
          style={{
            marginBottom: "28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 8px 0",
                color: "#60a5fa",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Production-Style EKS Demo
            </p>
            <h1
              style={{
                margin: 0,
                fontSize: "36px",
                lineHeight: 1.1,
                fontWeight: 800,
              }}
            >
              Frontend → Backend → RDS
            </h1>
            <p
              style={{
                marginTop: "12px",
                color: "#cbd5e1",
                maxWidth: "720px",
                lineHeight: 1.7,
              }}
            >
              Simple operational dashboard for validating application health,
              backend connectivity, and database access through the full stack.
	      This is new addition by Damir just to test functionality of argo image updater.
            </p>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            style={{
              background: loading ? "#334155" : "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "12px 18px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 8px 20px rgba(37,99,235,0.35)",
            }}
          >
            {loading ? "Refreshing..." : "Refresh Status"}
          </button>
        </div>

        {error && (
          <div
            style={{
              marginBottom: "20px",
              background: "rgba(127,29,29,0.55)",
              border: "1px solid rgba(248,113,113,0.4)",
              color: "#fecaca",
              borderRadius: "14px",
              padding: "16px",
            }}
          >
            <strong>Error:</strong> {error}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "18px",
            marginBottom: "24px",
          }}
        >
          <div style={cardStyle}>
            <div style={labelStyle}>Application</div>
            <div style={{ marginBottom: "12px" }}>
              <StatusBadge ok={!!rootData} text={rootData ? "Reachable" : "Unavailable"} />
            </div>
            <p style={valueStyle}>{rootData?.message || "No response yet"}</p>
          </div>

          <div style={cardStyle}>
            <div style={labelStyle}>Health Check</div>
            <div style={{ marginBottom: "12px" }}>
              <StatusBadge ok={healthOk} text={healthOk ? "Healthy" : "Unhealthy"} />
            </div>
            <p style={valueStyle}>
              {healthData ? `Status: ${healthData.status}` : "No response yet"}
            </p>
          </div>

          <div style={cardStyle}>
            <div style={labelStyle}>Database</div>
            <div style={{ marginBottom: "12px" }}>
              <StatusBadge ok={dbOk} text={dbOk ? "Connected" : "Not Connected"} />
            </div>
            <p style={valueStyle}>
              {dbData
                ? dbOk
                  ? "Backend successfully reached PostgreSQL."
                  : dbData.error || "Database check failed"
                : "No response yet"}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "18px",
          }}
        >
          <div style={cardStyle}>
            <div style={labelStyle}>Root Endpoint Response</div>
            <pre style={valueStyle}>{JSON.stringify(rootData, null, 2)}</pre>
          </div>

          <div style={cardStyle}>
            <div style={labelStyle}>Health Endpoint Response</div>
            <pre style={valueStyle}>{JSON.stringify(healthData, null, 2)}</pre>
          </div>

          <div style={cardStyle}>
            <div style={labelStyle}>Database Endpoint Response</div>
            <pre style={valueStyle}>{JSON.stringify(dbData, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
