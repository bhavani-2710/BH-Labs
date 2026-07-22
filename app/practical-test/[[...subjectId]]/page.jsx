"use client";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import { useData } from "@/context/DataProvider";
import Loading from "@/components/Loading";
import { setNavState } from "@/utils/navState";
const PracticalTest = dynamic(() => import("@/screens/PracticalTest"), {
  ssr: false,
  loading: () => <Loading />,
});
export default function Page() {
  const router = useRouter();
  const params = useParams();
  const subjectId = Array.isArray(params.subjectId) ? params.subjectId[0] : params.subjectId;
  const { subjects, loading } = useData();
  if (loading) return <Loading />;
  const subject = subjects.find((s) => s._id === subjectId);
  const testTitle = subject ? subject.name : "C Programming";
  return (
    <PracticalTest
      testTitle={testTitle}
      onNavigate={(page) => {
        if (page === "subjects") router.push("/subjects");
        else if (page === "dashboard") router.push("/dashboard");
        else router.push(`/${page}`);
      }}
      onSubmit={(result) => {
        const resultState = {
          correct: result.stats.correct,
          incorrect: result.stats.incorrect,
          unanswered: result.stats.unanswered,
          elapsed: result.elapsed,
          testTitle,
          questions: result.questions,
          answers: result.answers,
        };
        try { localStorage.setItem("practical_test_last_result", JSON.stringify(resultState)); } catch {}
        setNavState("assessmentResult", resultState);
        router.push("/assessment-result");
      }}
    />
  );
}
