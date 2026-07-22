"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useData } from "@/context/DataProvider";
import Loading from "@/components/Loading";
const Dashboard = dynamic(() => import("@/screens/Dashboard"), { ssr: false, loading: () => <Loading /> });
export default function Page() {
  const router = useRouter();
  const { subjects, experiments, loading, error } = useData();
  if (loading) return <Loading />;
  if (error) return <div className="text-red-600 p-8">Error: {error}</div>;
  return (
    <Dashboard
      subjects={subjects}
      experiments={experiments}
      onNavigate={(page, params) => {
        if (page === "subjects") router.push("/subjects");
        else if (page === "subject-detail") router.push(`/subject/${params.subjectId}`);
        else router.push(`/${page}`);
      }}
    />
  );
}
