"use client";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import { useData } from "@/context/DataProvider";
import Loading from "@/components/Loading";
import { setNavState } from "@/utils/navState";
const LabWorkspace = dynamic(() => import("@/screens/LabWorkspace"), { ssr: false, loading: () => <Loading /> });
const PracticalJournal = dynamic(() => import("@/screens/PracticalJournal"), { ssr: false, loading: () => <Loading /> });
export default function Page() {
  const router = useRouter();
  const params = useParams();
  const experimentId = params.experimentId;
  const subPart = (Array.isArray(params.part) ? params.part[0] : params.part) || "a";
  const { experiments, subjects, codeStore, handleSaveCode, loading, error } = useData();
  if (loading) return <Loading />;
  if (error) return <div className="text-red-600 p-8">Error: {error}</div>;
  const experiment = experiments.find((e) => e._id === experimentId);
  const subject = subjects.find((s) => s._id === experiment?.subjectId);
  const subExp = experiment?.subExperiments?.find((s) => s.part === subPart) || experiment?.subExperiments?.[0];
  if (subExp && subExp.isExecutable === false) {
    return <PracticalJournal experiment={experiment} subPart={subPart} onBack={() => router.back()} />;
  }
  return (
    <LabWorkspace
      experiment={experiment}
      subject={subject}
      subPart={subPart}
      savedCode={codeStore[`${experimentId}_${subPart}`] || ""}
      onSaveCode={handleSaveCode}
      onBack={() => router.back()}
      onNavigate={(page, p) => {
        if (page === "journal" || page === "journal-view") {
          setNavState("journal", { codeText: p.codeText, outputText: p.outputText });
          router.push(`/journal/${p.experimentId}/${p.subPart || p.part || "a"}`);
        }
      }}
    />
  );
}
