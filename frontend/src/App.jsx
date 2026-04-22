import { useEffect, useState } from "react";

function App() {
  const [health, setHealth] = useState("Checking backend...");
  const [dbStatus, setDbStatus] = useState("Not checked yet");

  useEffect(() => {
    fetch("/api/health")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Health check failed");
        }
        return res.json();
      })
      .then((data) => {
        setHealth(data.message || "Backend is healthy");
      })
      .catch(() => {
        setHealth("Backend health check failed");
      });
  }, []);

  const handleDbCheck = async () => {
    try {
      const res = await fetch("/api/db-check");
      if (!res.ok) {
        throw new Error("DB check failed");
      }
      const data = await res.json();
      setDbStatus(data.message || "Database connection successful");
    } catch {
      setDbStatus("Database connection failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        margin: 0,
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
        background: "#f4f7fb",
        color: "#1f2937",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "8px 14px",
            borderRadius: "999px",
            background: "#111827",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          GitOps pipeline test - updated via Argo CD Image Updater
        </div>

        <h1
          style={{
            marginTop: 0,
            marginBottom: "10px",
            fontSize: "36px",
          }}
        >
          EKS Microservices Demo v2
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "#4b5563",
            marginBottom: "30px",
          }}
        >
          Frontend updated successfully through GitHub Actions, ECR, Argo CD,
          and Argo CD Image Updater.
        </p>

        <div
          style={{
            display: "grid",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              padding: "18px",
              borderRadius: "12px",
              background: "#eef2ff",
              border: "1px solid #c7d2fe",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Backend Health</h3>
            <p style={{ marginBottom: 0 }}>{health}</p>
          </div>

          <div
            style={{
              padding: "18px",
              borderRadius: "12px",
              background: "#ecfeff",
              border: "1px solid #a5f3fc",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Database Check</h3>
            <p>{dbStatus}</p>
            <button
              onClick={handleDbCheck}
              style={{
                padding: "10px 16px",
                border: "none",
                borderRadius: "10px",
                background: "#2563eb",
                color: "#ffffff",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Run DB Check
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: "24px",
            paddingTop: "20px",
            borderTop: "1px solid #e5e7eb",
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          Version marker: <strong>frontend-gitops-test-v2</strong>
        </div>
      </div>
    </div>
  );
}

export default App;
