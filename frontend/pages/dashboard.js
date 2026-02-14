import { useEffect, useMemo, useState } from "react";
import ErrorBanner from "../components/ErrorBanner";
import Layout from "../components/Layout";
import { listIncidents } from "../services/api";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setErr("");
        const data = await listIncidents();
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, []);

  const filteredItems = useMemo(() => {
    return showArchived ? items : items.filter(x => x.status !== "ARCHIVED");
  }, [items, showArchived]);

  const byStatus = useMemo(() => {
    return {
      open: filteredItems.filter(x => x.status === "OPEN"),
      investigating: filteredItems.filter(x => x.status === "INVESTIGATING"),
      resolved: filteredItems.filter(x => x.status === "RESOLVED"),
      archived: items.filter(x => x.status === "ARCHIVED")
    };
  }, [filteredItems, items]);

  const stats = useMemo(() => {
    const total = filteredItems.length;
    const open = filteredItems.filter(x => x.status === "OPEN").length;
    const investigating = filteredItems.filter(x => x.status === "INVESTIGATING").length;
    const resolved = filteredItems.filter(x => x.status === "RESOLVED").length;
    const archived = items.filter(x => x.status === "ARCHIVED").length;
    const high = filteredItems.filter(x => x.severity === "HIGH").length;
    return { total, open, investigating, resolved, archived, high };
  }, [filteredItems, items]);

  return (
    <Layout title="Incident Dashboard">
      <ErrorBanner message={err} />
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
          />
          {' '}Show Archived Incidents
        </label>
      </div>

      <div className="kpis">
        <div className="kpi"><div className="kpi-label">Total</div><div className="kpi-value">{stats.total}</div></div>
        <div className="kpi"><div className="kpi-label">Open</div><div className="kpi-value">{stats.open}</div></div>
        <div className="kpi"><div className="kpi-label">Investigating</div><div className="kpi-value">{stats.investigating}</div></div>
        <div className="kpi"><div className="kpi-label">Resolved</div><div className="kpi-value">{stats.resolved}</div></div>
        <div className="kpi"><div className="kpi-label">High Severity</div><div className="kpi-value">{stats.high}</div></div>
      </div>

      <div className="grid3">
        <StatusColumn title="OPEN" items={byStatus.open} />
        <StatusColumn title="INVESTIGATING" items={byStatus.investigating} />
        <StatusColumn title="RESOLVED" items={byStatus.resolved} />
      </div>

      {showArchived && (
        <div style={{ marginTop: '20px' }}>
          <StatusColumn title="ARCHIVED" items={byStatus.archived} />
        </div>
      )}
    </Layout>
  );
}

function StatusColumn({ title, items }) {
  return (
    <div className="panel">
      <div className="panel-title">{title} ({items.length})</div>
      <div className="panel-body">
        {items.length === 0 ? (
          <div className="muted">No incidents</div>
        ) : (
          items.map(x => (
            <div key={x.id} className="card">
              <div className="card-title">{x.title}</div>
              <div className="card-meta">
                <span className="tag">{x.category}</span>
                <span className={`tag ${x.severity === "HIGH" ? "tag-danger" : x.severity === "MEDIUM" ? "tag-warn" : ""}`}>
                  {x.severity}
                </span>
              </div>
              <a className="link" href={`/incidents/${x.id}`}>Open</a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
