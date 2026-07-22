"use client";
import dynamic from "next/dynamic";
import Loading from "@/components/Loading";
const AssessmentResult = dynamic(() => import("@/screens/AssessmentResult"), {
  ssr: false,
  loading: () => <Loading />,
});
export default function Page() {
  return <AssessmentResult />;
}
