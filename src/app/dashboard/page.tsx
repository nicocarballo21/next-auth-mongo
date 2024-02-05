"use client";
/* eslint-disable @typescript-eslint/no-floating-promises */
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function Dashboard() {
  const session = useSession();
  const router = useRouter();

  console.log(session, "session");

  useEffect(() => {
    if (session.status !== "authenticated") {
      router.replace("/auth/signin");
    }
  }, [router, session.status]);

  return <div>Dashboard</div>;
}
