"use client";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

import SignInForm from "@/components/SignInForm";

export default function Login() {
  const session = useSession();
  const router = useRouter();

  console.log(session);

  useEffect(() => {
    if (session.status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [router, session.status]);

  return <SignInForm />;
}
