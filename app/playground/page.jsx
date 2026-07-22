"use client";
import dynamic from "next/dynamic";
import { useData } from "@/context/DataProvider";
import Loading from "@/components/Loading";
const Playground = dynamic(() => import("@/screens/Playground"), { ssr: false, loading: () => <Loading /> });
export default function Page() {
  const { experiments } = useData();
  return <Playground experiments={experiments} />;
}
