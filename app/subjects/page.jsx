"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useData } from "@/context/DataProvider";
import Loading from "@/components/Loading";
const SubjectsListPage = dynamic(() => import("@/screens/SubjectsListPage"), { ssr: false, loading: () => <Loading /> });
export default function Page() {
  const router = useRouter();
  const { subjects, experiments, loading, error } = useData();
  if (loading) return <Loading />;
  if (error) return <div className="text-red-600 p-8">Error: {error}</div>;
  return (
    <SubjectsListPage
      experiments={experiments}
      subjects={subjects}
      onNavigate={(page, params) => {
        if (page === "subject-detail") router.push(`/subject/${params.subjectId}${params.deptId ? `?dept=${params.deptId}` : ""}`);
        else if (page === "test-instructions") router.push(`/test-instructions/${params.subjectId}`);
        else router.push(`/${page}`);
      }}
      onSelectSubject={(subjectId, deptId) => router.push(`/subject/${subjectId}${deptId ? `?dept=${deptId}` : ""}`)}
    />
  );
}
