"use client";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import { useData } from "@/context/DataProvider";
import Loading from "@/components/Loading";
import { getNavState } from "@/utils/navState";
const PracticalJournal = dynamic(() => import("@/screens/PracticalJournal"), { ssr: false, loading: () => <Loading /> });
export default function Page() {
  const router = useRouter();
  const params = useParams();
  const experimentId = params.experimentId;
  const part = (Array.isArray(params.part) ? params.part[0] : params.part) || "a";
  const { experiments, codeStore, loading, error } = useData();
  if (loading) return <Loading />;
  if (error) return <div className="text-red-600 p-8">Error: {error}</div>;
  const experiment = experiments.find((e) => e._id === experimentId);
  const nav = getNavState("journal") || {};
  const codeText = nav.codeText || codeStore[`${experimentId}_${part}`] || "";
  const outputText = nav.outputText || "";
  return (
    <PracticalJournal experiment={experiment} subPart={part} codeText={codeText} outputText={outputText} onBack={() => router.back()} />
  );
}
