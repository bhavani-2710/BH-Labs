"use client";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import { useData } from "@/context/DataProvider";
import Loading from "@/components/Loading";
const TestInstruction = dynamic(() => import("@/screens/TestInstruction"), { ssr: false, loading: () => <Loading /> });
export default function Page() {
  const router = useRouter();
  const params = useParams();
  const subjectId = Array.isArray(params.subjectId) ? params.subjectId[0] : params.subjectId;
  const { subjects, loading } = useData();
  if (loading) return <Loading />;
  const subject = subjects.find((s) => s._id === subjectId);
  const testTitle = subject ? subject.name : "C Programming";
  return (
    <TestInstruction
      testTitle={testTitle}
      onNavigate={(page) => {
        if (page === "subjects") router.push("/subjects");
        else if (page === "dashboard") router.push("/dashboard");
        else router.push(`/${page}`);
      }}
    />
  );
}
