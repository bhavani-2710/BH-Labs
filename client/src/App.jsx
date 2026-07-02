import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import SubjectsListPage from "./pages/SubjectsListPage";
import SubjectDetailPage from "./pages/ExperimentListPage";
import LabWorkspace from "./pages/LabWorkspace";
import PracticalJournal from "./pages/PracticalJournal";
import AptitudeTest from "./pages/AptitudeTest";
import TestInstruction from "./pages/TestInstruction";
import AssessmentResult from "./pages/AssessmentResult";

const API = import.meta.env.VITE_API_URL;

// ====================== WRAPPERS ======================

function SubjectsListWrapper() {
  const navigate = useNavigate();
  return (
    <SubjectsListPage
      onNavigate={(page, params) => {
        if (page === "subject-detail") navigate(`/subject/${params.subjectId}`);
        else if (page === "test-instructions")
          navigate(`/test-instructions/${params.subjectId}`);
        else navigate(`/${page}`);
      }}
      onSelectSubject={(subjectId) => navigate(`/subject/${subjectId}`)}
    />
  );
}

function SubjectDetailWrapper({
  subjects,
  experiments,
  subjectSpecificExperiments,
  setSubjectSpecificExperiments,
}) {
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
  const experiment = experiments.find((e) => e._id === experimentId);

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
        if (page === "journal")
          navigate(`/journal/${params.experimentId}/${params.part || "a"}`);
      }}
    />
  );
}

function AptitudeTestWrapper({ subjects }) {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const subject = subjects.find((s) => s._id === subjectId);
  const testTitle = subject ? subject.name : "C Programming";

  return (
    <AptitudeTest
      testTitle={testTitle}
      onNavigate={(page, params) => {
        if (page === "subjects") navigate("/subjects");
        else if (page === "dashboard") navigate("/dashboard");
        else navigate(`/${page}`);
      }}
      onSubmit={(result) => {
        navigate("/assessment-result", {
          state: {
            correct: result.stats.correct,
            incorrect: result.stats.incorrect,
            unanswered: result.stats.unanswered,
            elapsed: result.elapsed,
            testTitle: testTitle,
            questions: result.questions,
            answers: result.answers,
          },
        });
      }}
    />
  );
}

function TestInstructionWrapper({ subjects }) {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const subject = subjects.find((s) => s._id === subjectId);
  const testTitle = subject ? subject.name : "C Programming";

  return (
    <TestInstruction
      testTitle={testTitle}
      onNavigate={(page) => {
        if (page === "subjects") navigate("/subjects");
        else if (page === "dashboard") navigate("/dashboard");
        else navigate(`/${page}`);
      }}
    />
  );
}

function AssessmentResultWrapper() {
  const navigate = useNavigate();
  return <AssessmentResult />;
}

function JournalWrapper({ experiments, codeStore }) {
  const { experimentId, part } = useParams();
  const navigate = useNavigate();
  const experiment = experiments.find((e) => e._id === experimentId);
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
  const [subjects, setSubjects] = useState([]);
  const [experiments, setExperiments] = useState([]);
  const [subjectSpecificExperiments, setSubjectSpecificExperiments] = useState(
    [],
  );
  const [codeStore, setCodeStore] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [subjectsRes, experimentsRes] = await Promise.all([
          fetch(`${API}/subjects`),
          fetch(`${API}/experiments`),
        ]);
        if (!subjectsRes.ok || !experimentsRes.ok)
          throw new Error("Failed to load data");
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
    setCodeStore((prev) => ({ ...prev, [key]: codeContent }));
    try {
      // await fetch(`${API}/codes`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ key, code: codeContent }),
      // });
      console.log(JSON.stringify({ key, code: codeContent }));
    } catch (e) {
      console.error("Save failed", e);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading BH.Lab...
      </div>
    );
  if (error) return <div className="text-red-600 p-8">Error: {error}</div>;

  return (
    <Routes>
      <Route
        path="/"
        element={<LandingPage onStart={() => navigate("/dashboard")} />}
      />

      <Route
        path="/dashboard"
        element={
          <Dashboard
            subjects={subjects}
            experiments={experiments}
            onNavigate={(page, params) => {
              if (page === "subjects") navigate("/subjects");
              else if (page === "subject-detail")
                navigate(`/subject/${params.subjectId}`);
            }}
          />
        }
      />

      <Route path="/subjects" element={<SubjectsListWrapper />} />

      <Route
        path="/subject/:subjectId"
        element={
          <SubjectDetailWrapper
            subjects={subjects}
            experiments={experiments}
            subjectSpecificExperiments={subjectSpecificExperiments}
            setSubjectSpecificExperiments={setSubjectSpecificExperiments}
          />
        }
      />

      <Route
        path="/workspace/:experimentId/:part?"
        element={
          <WorkspaceWrapper
            experiments={experiments}
            codeStore={codeStore}
            onSaveCode={handleSaveCode}
          />
        }
      />

      <Route
        path="/journal/:experimentId/:part?"
        element={
          <JournalWrapper experiments={experiments} codeStore={codeStore} />
        }
      />

      <Route
        path="/aptitude-test"
        element={<AptitudeTestWrapper subjects={subjects} />}
      />
      <Route
        path="/aptitude-test/:subjectId"
        element={<AptitudeTestWrapper subjects={subjects} />}
      />

      <Route
        path="/test-instructions"
        element={<TestInstructionWrapper subjects={subjects} />}
      />
      <Route
        path="/test-instructions/:subjectId"
        element={<TestInstructionWrapper subjects={subjects} />}
      />

      <Route
        path="/assessment-result"
        element={<AssessmentResultWrapper />}
      />

      <Route
        path="*"
        element={<LandingPage onStart={() => navigate("/dashboard")} />}
      />
    </Routes>
  );
}
