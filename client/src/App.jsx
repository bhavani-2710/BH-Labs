import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import SubjectsListPage from "./pages/SubjectsListPage";
import SubjectDetailPage from "./pages/SubjectPage";
import LabWorkspace from "./pages/LabWorkspace";
import VivaPractice from "./pages/VivaPractice";
import PracticalJournal from "./pages/PracticalJournal";

const API = "/api";

// ====================== WRAPPERS ======================

function SubjectsListWrapper() {
  const navigate = useNavigate();
  return (
    <SubjectsListPage
      onNavigate={(page, params) => {
        if (page === "subject-detail")    navigate(`/subject/${params.subjectId}`);
        else if (page === "viva-subject") navigate(`/viva/subject/${params.subjectId}`);
        else                              navigate(`/${page}`);
      }}
      onSelectSubject={(subjectId) => navigate(`/subject/${subjectId}`)}
    />
  );
}

function SubjectDetailWrapper({ subjects, experiments, subjectSpecificExperiments, setSubjectSpecificExperiments }) {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!subjectId) return;
    const fetchSubjectExperiments = async () => {
      try {
        const res = await fetch(`${API}/experiments/subject/${subjectId}`);
        if (res.ok) {
          const data = await res.json();
          setSubjectSpecificExperiments(data);
        }
      } catch (err) {
        console.error("Failed to fetch subject experiments:", err);
      }
    };
    fetchSubjectExperiments();
  }, [subjectId, setSubjectSpecificExperiments]);

  return (
    <SubjectDetailPage
      subjectId={subjectId}
      subjects={subjects}
      experiments={subjectSpecificExperiments}
      onNavigate={(page, params) => {
        if (page === "workspace") {
          navigate(`/workspace/${params.experimentId}/${params.part || "a"}`);
        } else if (page === "subjects") {
          navigate("/subjects");
        } else {
          navigate(`/${page}`);
        }
      }}
      onSelectExperiment={(expId, part) =>
        navigate(`/workspace/${expId}/${part || "a"}`)
      }
    />
  );
}

function WorkspaceWrapper({ experiments, codeStore, onSaveCode }) {
  const { experimentId, part } = useParams();
  const navigate = useNavigate();
  const experiment = experiments.find(e => e._id === experimentId);

  return (
    <LabWorkspace
      experiment={experiment}
      subPart={part || "a"}
      savedCode={codeStore[`${experimentId}_${part || "a"}`] || ""}
      onSaveCode={onSaveCode}
      onBack={() => {
        if (experiment?.subjectId) navigate(`/subject/${experiment.subjectId}`);
        else navigate("/subjects");
      }}
      onNavigate={(page, params) => {
        if (page === "viva")    navigate(`/viva/${params.experimentId}/${params.part || "a"}`);
        if (page === "journal") navigate(`/journal/${params.experimentId}/${params.part || "a"}`);
      }}
    />
  );
}

function VivaWrapper({ experiments, onCompleteViva }) {
  const { experimentId, part } = useParams();
  const navigate = useNavigate();
  const experiment = experiments.find(e => e._id === experimentId);

  return (
    <VivaPractice
      experiment={experiment}
      subPart={part || "a"}
      onBack={() => navigate(`/workspace/${experimentId}/${part || "a"}`)}
      onCompleteViva={onCompleteViva}
    />
  );
}

/**
 * SubjectVivaWrapper — launched from the Subjects list page via "Take Viva".
 * Looks up the first experiment belonging to this subject and boots VivaPractice.
 * Falls back gracefully if no experiments are found yet.
 */
function SubjectVivaWrapper({ experiments, onCompleteViva }) {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [subjectExperiments, setSubjectExperiments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!subjectId) return;
    const fetchExperiments = async () => {
      try {
        const res = await fetch(`${API}/experiments/subject/${subjectId}`);
        if (res.ok) {
          const data = await res.json();
          setSubjectExperiments(data);
        }
      } catch (err) {
        console.error("SubjectVivaWrapper fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiments();
  }, [subjectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading viva…
      </div>
    );
  }

  const firstExperiment = subjectExperiments[0];

  if (!firstExperiment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-gray-600">
        <p className="text-lg font-medium">No experiments found for this subject.</p>
        <button
          onClick={() => navigate(`/subject/${subjectId}`)}
          className="px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700"
        >
          Back to Subject
        </button>
      </div>
    );
  }

  return (
    <VivaPractice
      experiment={firstExperiment}
      subPart="a"
      onBack={() => navigate(`/subject/${subjectId}`)}
      onCompleteViva={onCompleteViva}
    />
  );
}

function JournalWrapper({ experiments, codeStore }) {
  const { experimentId, part } = useParams();
  const navigate = useNavigate();
  const experiment = experiments.find(e => e._id === experimentId);
  const key = `${experimentId}_${part || "a"}`;

  return (
    <PracticalJournal
      experiment={experiment}
      subPart={part || "a"}
      codeText={codeStore[key] || ""}
      onBack={() => navigate(`/workspace/${experimentId}/${part || "a"}`)}
    />
  );
}

// ====================== MAIN APP ======================

export default function App() {
  const [subjects, setSubjects]                                   = useState([]);
  const [experiments, setExperiments]                             = useState([]);
  const [subjectSpecificExperiments, setSubjectSpecificExperiments] = useState([]);
  const [codeStore, setCodeStore]                                 = useState({});
  const [vivaScores, setVivaScores]                               = useState({});
  const [loading, setLoading]                                     = useState(true);
  const [error, setError]                                         = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [subjectsRes, experimentsRes] = await Promise.all([
          fetch(`${API}/subjects`),
          fetch(`${API}/experiments`),
        ]);
        if (!subjectsRes.ok || !experimentsRes.ok) throw new Error("Failed to load data");
        setSubjects(await subjectsRes.json());
        setExperiments(await experimentsRes.json());
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleSaveCode = async (expId, part, codeContent) => {
    const key = `${expId}_${part}`;
    setCodeStore(prev => ({ ...prev, [key]: codeContent }));
    try {
      await fetch(`${API}/codes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, code: codeContent }),
      });
    } catch (e) {
      console.error("Save failed", e);
    }
  };

  const handleCompleteViva = async (score, experimentId, part) => {
    const key = `${experimentId}_${part || "a"}`;
    setVivaScores(prev => ({ ...prev, [key]: score }));
    try {
      await fetch(`${API}/vivas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, score }),
      });
    } catch (e) {
      console.error("Viva save failed", e);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading BH.Lab...</div>;
  if (error)   return <div className="text-red-600 p-8">Error: {error}</div>;

  return (
    <Routes>
      <Route path="/" element={<LandingPage onStart={() => navigate("/dashboard")} />} />

      <Route path="/dashboard" element={
        <Dashboard
          subjects={subjects}
          experiments={experiments}
          onNavigate={(page, params) => {
            if (page === "subjects")      navigate("/subjects");
            else if (page === "subject-detail") navigate(`/subject/${params.subjectId}`);
          }}
        />
      } />

      <Route path="/subjects" element={<SubjectsListWrapper />} />

      <Route path="/subject/:subjectId" element={
        <SubjectDetailWrapper
          subjects={subjects}
          experiments={experiments}
          subjectSpecificExperiments={subjectSpecificExperiments}
          setSubjectSpecificExperiments={setSubjectSpecificExperiments}
        />
      } />

      <Route path="/workspace/:experimentId/:part?" element={
        <WorkspaceWrapper
          experiments={experiments}
          codeStore={codeStore}
          onSaveCode={handleSaveCode}
        />
      } />

      {/* Viva from workspace (experiment-level) */}
      <Route path="/viva/:experimentId/:part?" element={
        <VivaWrapper experiments={experiments} onCompleteViva={handleCompleteViva} />
      } />

      {/* Viva from subjects list (subject-level → first experiment) */}
      <Route path="/viva/subject/:subjectId" element={
        <SubjectVivaWrapper experiments={experiments} onCompleteViva={handleCompleteViva} />
      } />

      <Route path="/journal/:experimentId/:part?" element={
        <JournalWrapper experiments={experiments} codeStore={codeStore} />
      } />

      <Route path="*" element={<LandingPage onStart={() => navigate("/dashboard")} />} />
    </Routes>
  );
}