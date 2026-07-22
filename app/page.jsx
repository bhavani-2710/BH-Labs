"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
const LandingPage = dynamic(() => import("@/screens/LandingPage"), { ssr: false, loading: () => <Loading /> });
export default function Page() {
  const router = useRouter();
  return <LandingPage onStart={() => router.push("/dashboard")} />;
}
