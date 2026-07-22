"use client";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useData } from "@/context/DataProvider";
import Loading from "@/components/Loading";
const ExperimentListPage = dynamic(() => import("@/screens/ExperimentListPage"), { ssr: false, loading: () => <Loading /> });
export default function Page() {
  const router = useRouter();
  const { subjectId } = useParams();
  const deptId = useSearchParams().get("dept");
  const { subjects, subjectSpecificExperiments, fetchSubjectExperiments, loading, error } = useData();
  useEffect(() => { fetchSubjectExperiments(subjectId); }, [subjectId, fetchSubjectExperiments]);
  if (loading) return <Loading />;
  if (error) return <div className="text-red-600 p-8">Error: {error}</div>;
  return (
    <ExperimentListPage
      subjectId={subjectId}
      subjects={subjects}
      experiments={subjectSpecificExperiments}
      deptId={deptId}
      onNavigate={(page, params) => {
        if (page === "workspace") router.push(`/workspace/${params.experimentId}/${params.part || "a"}`);
        else if (page === "subjects") router.push("/subjects");
        else router.push(`/${page}`);
      }}
      onSelectExperiment={(expId, part) => router.push(`/workspace/${expId}/${part || "a"}`)}
    />
  );
}
