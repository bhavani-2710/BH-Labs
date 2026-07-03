import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import SubjectsListPage from "./pages/SubjectsListPage";
import SubjectDetailPage from "./pages/ExperimentListPage";
import LabWorkspace from "./pages/LabWorkspace";
import PracticalJournal from "./pages/PracticalJournal";
import PracticalTest from "./pages/PracticalTest";
import TestInstruction from "./pages/TestInstruction";
import AssessmentResult from "./pages/AssessmentResult";

const API = import.meta.env.VITE_API_URL;

// ====================== ROUTE WRAPPER COMPONENTS ======================
// Each wrapper reads URL params, wires up navigation callbacks, and passes
// clean props to the page component. This keeps page components free of
// routing concerns.

/**
 * SubjectsListWrapper
 * Wraps SubjectsListPage to inject navigate-based callbacks.
 * Handles navigation to subject detail, test instructions, and generic pages.
 */
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

/**
 * SubjectDetailWrapper
 * Reads the subjectId URL param and fetches subject-specific experiments on
 * mount. Passes them down to ExperimentListPage alongside navigation handlers.
 */
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

/**
 * WorkspaceWrapper
 * Reads experimentId and part URL params, looks up the matching experiment
 * from the global list, and provides the lab workspace with its code state
 * and save handler.
 */
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
      onBack={() => navigate(-1)}
      onNavigate={(page, params) => {
        if (page === "journal")
          navigate(`/journal/${params.experimentId}/${params.part || "a"}`);
      }}
    />
  );
}

/**
 * PracticalTestWrapper
 * Reads the subjectId URL param to resolve the test title from the subjects
 * list, serialises the result to localStorage for recovery, and navigates
 * to the assessment result page on submit.
 */
function PracticalTestWrapper({ subjects }) {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const subject = subjects.find((s) => s._id === subjectId);
  const testTitle = subject ? subject.name : "C Programming";

  return (
    <PracticalTest
      testTitle={testTitle}
      onNavigate={(page, params) => {
        if (page === "subjects") navigate("/subjects");
        else if (page === "dashboard") navigate("/dashboard");
        else navigate(`/${page}`);
      }}
      onSubmit={(result) => {
        const resultState = {
          correct: result.stats.correct,
          incorrect: result.stats.incorrect,
          unanswered: result.stats.unanswered,
          elapsed: result.elapsed,
          testTitle: testTitle,
          questions: result.questions,
          answers: result.answers,
        };
        localStorage.setItem(
          "practical_test_last_result",
          JSON.stringify(resultState),
        );
        navigate("/assessment-result", {
          state: resultState,
        });
      }}
    />
  );
}

/**
 * TestInstructionWrapper
 * Reads the subjectId URL param and resolves the subject name to display
 * on the instructions screen.
 */
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

/**
 * JournalWrapper
 * Reads experimentId and part URL params to identify the experiment and
 * retrieve the saved code for the journal view.
 */
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
      onBack={() => navigate(-1)}
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

  /**
   * handleSaveCode
   * Stores the latest editor code in component state keyed by `${expId}_${part}`.
   * Code is held in local state only; API persistence is not yet enabled.
   *
   * @param {string} expId       - The experiment MongoDB _id.
   * @param {string} part        - Sub-experiment part (e.g. "a", "b").
   * @param {string} codeContent - The full code string from the editor.
   */
  const handleSaveCode = (expId, part, codeContent) => {
    const key = `${expId}_${part}`;
    setCodeStore((prev) => ({ ...prev, [key]: codeContent }));
    // Code is stored in local state; persistence via API is not yet enabled.
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
        path="/practical-test"
        element={<PracticalTestWrapper subjects={subjects} />}
      />
      <Route
        path="/practical-test/:subjectId"
        element={<PracticalTestWrapper subjects={subjects} />}
      />

      <Route
        path="/test-instructions"
        element={<TestInstructionWrapper subjects={subjects} />}
      />
      <Route
        path="/test-instructions/:subjectId"
        element={<TestInstructionWrapper subjects={subjects} />}
      />

      <Route path="/assessment-result" element={<AssessmentResult />} />

      <Route
        path="*"
        element={<LandingPage onStart={() => navigate("/dashboard")} />}
      />
    </Routes>
  );
}
