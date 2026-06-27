import { useState, useMemo } from "react";
import { 
  LayoutDashboard, BookOpen, Mic2, FileSpreadsheet, Settings, LogOut, 
  Share2, Play, Download, ArrowRight, ChevronRight, Terminal, AlertCircle, ChevronDown 
} from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@450&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', sans-serif;
    background: #FAFAFA;
    color: #09090B;
    overflow-x: hidden;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #FAFAFA; }
  ::-webkit-scrollbar-thumb { background: #E4E4E7; border-radius: 10px; }

  /* Sidebar */
  .sidebar {
    position: fixed; left: 0; top: 0; height: 100%; width: 256px;
    display: flex; flex-direction: column; padding: 24px 16px;
    background: #fff; border-right: 1px solid #E4E4E7; z-index: 40;
  }
  @media (max-width: 768px) { .sidebar { display: none; } }

  .sidebar-logo-title { font-weight: 700; font-size: 24px; color: #7C3AED; letter-spacing: -0.02em; }
  .sidebar-logo-sub { font-size: 11px; font-weight: 600; color: #52525B; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px; }

  .nav-link {
    display: flex; align-items: center; gap: 16px;
    padding: 8px 16px; border-radius: 8px;
    font-size: 14px; font-weight: 500; color: #52525B;
    text-decoration: none; cursor: pointer; border: none; background: none;
    width: 100%; text-align: left; transition: background 0.15s, color 0.15s;
  }
  .nav-link:hover { background: #FAFAFA; color: #09090B; }
  .nav-link.active { background: #F5F3FF; color: #7C3AED; font-weight: 600; }
  .nav-link svg { width: 20px; height: 20px; flex-shrink: 0; }

  .sidebar-divider { border-top: 1px solid #E4E4E7; margin-top: auto; padding-top: 24px; }

  /* Main shell */
  .main-shell { margin-left: 256px; min-height: 100vh; display: flex; flex-direction: column; }
  @media (max-width: 768px) { .main-shell { margin-left: 0; } }

  .top-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 24px; background: #fff; border-bottom: 1px solid #E4E4E7;
    position: sticky; top: 0; z-index: 30;
    flex-wrap: wrap; gap: 12px;
  }

  .breadcrumb { display: flex; align-items: center; gap: 4px; font-size: 13px; color: #52525B; }
  .breadcrumb-active { color: #09090B; font-weight: 600; }

  .header-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

  .btn-primary, .btn-start {
    padding: 8px 24px; background: #7C3AED; color: #fff;
    font-weight: 700; border-radius: 999px; font-size: 14px;
    border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
    transition: box-shadow 0.2s, background 0.15s;
  }
  .btn-primary:hover, .btn-start:hover { background: rgba(124,58,237,0.9); box-shadow: 0 4px 12px rgba(124,58,237,0.25); }

  .btn-outline, .btn-view {
    padding: 8px 24px; background: #fff; color: #09090B;
    font-weight: 700; border-radius: 999px; font-size: 14px;
    border: 1px solid #E4E4E7; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
  }
  .btn-outline:hover, .btn-view:hover { background: #FAFAFA; }

  .btn-icon {
    width: 36px; height: 36px; background: #fff; border: 1px solid #E4E4E7;
    border-radius: 999px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #52525B;
  }
  .btn-icon:hover { color: #7C3AED; }

  .content-area { flex: 1; padding: 24px; max-width: 1260px; margin: 0 auto; width: 100%; }

  .content-grid {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 24px;
    align-items: start;
  }
  @media (max-width: 1024px) { .content-grid { grid-template-columns: 1fr; } }

  .page-identity {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-bottom: 32px; gap: 16px; flex-wrap: wrap;
  }
  .page-title { font-size: 30px; font-weight: 700; color: #09090B; margin-bottom: 2px; }
  .page-meta { font-size: 13px; font-weight: 500; color: #52525B; }

  .filter-group {
    display: flex; gap: 2px; padding: 4px;
    background: #F4F4F5; border-radius: 999px; width: fit-content;
  }
  .filter-pill {
    padding: 6px 16px; border-radius: 999px; font-size: 12px; font-weight: 600;
    border: none; cursor: pointer; color: #52525B; background: transparent;
  }
  .filter-pill:hover { color: #09090B; }
  .filter-pill.active { background: #fff; color: #09090B; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }

  .main-exp-card {
    background: #fff; border-radius: 12px; padding: 20px 24px;
    border: 1px solid #E4E4E7;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04);
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .main-exp-header {
    display: flex; align-items: center; gap: 20px; cursor: pointer;
  }

  .main-exp-number {
    flex-shrink: 0; width: 64px; height: 64px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 20px; background: #F5F3FF; color: #7C3AED;
  }

  .main-exp-info { flex: 1; min-width: 0; }
  .main-exp-title { font-size: 18px; font-weight: 700; color: #09090B; margin-bottom: 6px; }

  .toggle-icon {
    transition: transform 0.2s ease;
  }
  .toggle-icon.expanded { transform: rotate(180deg); }

  .sub-exp-card {
    background: #FAFAFA; border-radius: 10px; padding: 16px 20px;
    border: 1px solid #E4E4E7; margin-top: 12px;
    display: flex; align-items: center; gap: 16px;
  }

  .sub-exp-part {
    font-size: 13px; font-weight: 700; color: #7C3AED; 
    background: #F5F3FF; padding: 2px 10px; border-radius: 999px;
  }

  .sub-exp-title { font-size: 15px; font-weight: 600; color: #09090B; flex: 1; }

  .exp-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex-shrink: 0; }

  .analytics-card {
    background: #fff; border-radius: 12px; padding: 24px;
    border: 1px solid #E4E4E7;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04);
    position: sticky; top: 88px;
  }
  .analytics-title { font-size: 17px; font-weight: 700; color: #09090B; margin-bottom: 16px; }

  .progress-ring-wrap { display: flex; justify-content: center; padding: 16px 0; position: relative; }
  .progress-label { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; }
  .progress-pct { font-size: 24px; font-weight: 700; color: #09090B; }
  .progress-sub { font-size: 10px; font-weight: 700; color: #52525B; text-transform: uppercase; letter-spacing: 0.08em; }

  .stat-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 500; color: #52525B; margin-bottom: 6px; }
  .stat-val-green { color: #059669; font-weight: 700; }
  .stat-val-amber { color: #D97706; font-weight: 700; }

  .progress-bar-wrap { width: 100%; height: 6px; background: #F4F4F5; border-radius: 999px; overflow: hidden; margin-bottom: 16px; }
  .progress-bar-fill { height: 100%; border-radius: 999px; }

  .analytics-hint {
    font-size: 12px; color: #52525B; font-style: italic; line-height: 1.6;
    border-top: 1px solid #E4E4E7; padding-top: 16px; margin-top: 4px;
  }

  .btn-export {
    width: 100%; padding: 12px; background: #FAFAFA; border: 1px solid #E4E4E7;
    color: #09090B; font-weight: 700; font-size: 13px; border-radius: 10px;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
    margin-top: 16px;
  }
`;

export default function SubjectPage({
  onNavigate,
  subjectId,
  subjects = [],
  experiments = [],
  onSelectExperiment,
}) {
  const [filter, setFilter] = useState("all");
  const [expandedExperiments, setExpandedExperiments] = useState(new Set());

  const currentSubject = subjects.find((s) => s._id === subjectId) || subjects[0];

  const subjectExperiments = useMemo(() => {
    if (!subjectId) return [];
    return experiments.filter((e) => {
      return (
        e.subjectId === subjectId || 
        e.subject === subjectId ||
        e.subjectId?._id === subjectId
      );
    });
  }, [experiments, subjectId]);

  // Simplified status - everything is accessible
  const getExperimentStatus = () => "PENDING";

  const toggleExpand = (expId) => {
    setExpandedExperiments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(expId)) {
        newSet.delete(expId);
      } else {
        newSet.add(expId);
      }
      return newSet;
    });
  };

  const filteredMainExperiments = useMemo(() => {
    return subjectExperiments.filter(() => true); // Show all
  }, [subjectExperiments]);

  const completedCount = 0;
  const pendingCount = subjectExperiments.length;
  const total = subjectExperiments.length || 0;
  const pct = 0;

  const R = 58;
  const C = 2 * Math.PI * R;
  const offset = C;

  return (
    <>
      <style>{styles}</style>

      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ marginBottom: 32, paddingLeft: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ width: 32, height: 32, background: "#7C3AED", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Terminal size={16} color="#fff" />
            </div>
            <span className="sidebar-logo-title">BH.Lab</span>
          </div>
          <p className="sidebar-logo-sub">Engineering Portal</p>
        </div>

        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <button onClick={() => onNavigate?.("dashboard")} className="nav-link">
            <LayoutDashboard size={20} /><span>Dashboard</span>
          </button>
          <button className="nav-link active">
            <BookOpen size={20} /><span>My Subjects</span>
          </button>
          <button onClick={() => onNavigate?.("viva-practice-menu")} className="nav-link">
            <Mic2 size={20} /><span>Viva Practice</span>
          </button>
          <button onClick={() => onNavigate?.("journals")} className="nav-link">
            <FileSpreadsheet size={20} /><span>My Journals</span>
          </button>
        </nav>

        <div className="sidebar-divider" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <button className="nav-link"><Settings size={20} /><span>Settings</span></button>
          <button onClick={() => onNavigate?.("landing")} className="nav-link" style={{ color: "#E11D48" }}>
            <LogOut size={20} /><span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-shell">
        <header className="top-header">
          <div className="breadcrumb">
            <button 
              onClick={() => onNavigate?.("dashboard")} 
              style={{ background: "none", border: "none", cursor: "pointer", color: "#52525B", fontSize: 13 }}
            >
              Dashboard
            </button>
            <ChevronRight size={14} />
            <span className="breadcrumb-active">{currentSubject?.name || "C Programming"}</span>
          </div>
          <div className="header-actions">
            <button className="btn-icon"><Share2 size={16} /></button>
            <div style={{ width: 1, height: 24, background: "#E4E4E7" }} />
            <button 
              className="btn-primary" 
              onClick={() => {
                const firstExp = subjectExperiments[0];
                if (firstExp?.subExperiments?.[0]) {
                  onSelectExperiment?.(firstExp._id, firstExp.subExperiments[0].part);
                }
              }}
            >
              Run First
            </button>
            <button className="btn-outline" onClick={() => onNavigate?.("journals")}>Generate Journal</button>
          </div>
        </header>

        <div className="content-area">
          <div className="page-identity">
            <div>
              <h2 className="page-title">{currentSubject?.name || "C Programming"}</h2>
              <p className="page-meta">{total} Experiments · Semester {currentSubject?.semester || 3}</p>
            </div>

            <div className="filter-group">
              <button className="filter-pill active">All ({total})</button>
            </div>
          </div>

          <div className="content-grid">
            {/* Experiments List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {filteredMainExperiments.length > 0 ? (
                filteredMainExperiments.map((exp) => {
                  const num = String(exp.experimentNumber || exp.number || "??").padStart(2, "0");
                  const isExpanded = expandedExperiments.has(exp._id);
                  const subExperiments = exp.subExperiments || [];
                  const hasSubs = subExperiments.length > 0;

                  return (
                    <div key={exp._id} className="main-exp-card">
                      <div 
                        className="main-exp-header" 
                        onClick={() => hasSubs && toggleExpand(exp._id)}
                      >
                        <div className="main-exp-number">{num}</div>

                        <div className="main-exp-info">
                          <div className="main-exp-title">
                            Experiment {num}
                          </div>
                          {hasSubs && (
                            <div style={{ fontSize: "13px", color: "#52525B" }}>
                              {subExperiments.length} Parts
                            </div>
                          )}
                        </div>

                        {hasSubs && (
                          <ChevronDown 
                            size={20} 
                            className={`toggle-icon ${isExpanded ? "expanded" : ""}`} 
                            color="#52525B"
                          />
                        )}
                      </div>

                      {/* Sub-experiments - Always accessible */}
                      {isExpanded && hasSubs && (
                        <div style={{ marginTop: 16 }}>
                          {subExperiments.map((sub, index) => (
                            <div key={index} className="sub-exp-card">
                              <div className="sub-exp-part">PART {sub.part?.toUpperCase() || (index + 1)}</div>
                              
                              <div className="sub-exp-title">
                                {sub.title || `Sub-experiment ${sub.part}`}
                              </div>

                              <div className="exp-actions">
                                <button 
                                  className="btn-start" 
                                  onClick={() => onSelectExperiment?.(exp._id, sub.part)}
                                >
                                  Start <Play size={12} fill="#fff" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: "center", padding: 80, color: "#52525B" }}>
                  <AlertCircle size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                  <h3>No experiments found</h3>
                </div>
              )}
            </div>

            {/* Analytics Sidebar */}
            <div className="analytics-card">
              <div className="analytics-title">Lab Analytics</div>

              <div className="progress-ring-wrap">
                <svg width="128" height="128" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="64" cy="64" r={R} fill="transparent" stroke="#F4F4F5" strokeWidth="8" />
                  <circle 
                    cx="64" 
                    cy="64" 
                    r={R} 
                    fill="transparent" 
                    stroke="#7C3AED" 
                    strokeWidth="8"
                    strokeDasharray={C} 
                    strokeDashoffset={offset} 
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="progress-label">
                  <div className="progress-pct">0%</div>
                  <div className="progress-sub">Overall</div>
                </div>
              </div>

              <div style={{ marginTop: 8 }}>
                <div className="stat-row">
                  <span>Completed</span>
                  <span className="stat-val-green">0 / {total}</span>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: "0%", background: "#10B981" }} />
                </div>

                <div className="stat-row">
                  <span>Pending</span>
                  <span className="stat-val-amber">{total} / {total}</span>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: "100%", background: "#F59E0B" }} />
                </div>
              </div>

              <p className="analytics-hint">
                Start working on the experiments to generate your semester journal.
              </p>

              <button className="btn-export">
                <Download size={16} /> Export Progress Report
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ padding: "32px 24px", borderTop: "1px solid #E4E4E7", background: "#fff", marginTop: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span className="footer-brand">BH.Lab</span>
            <span className="footer-copy">© 2026 BH.Lab Engineering. All rights reserved.</span>
          </div>
        </footer>
      </div>
    </>
  );
}