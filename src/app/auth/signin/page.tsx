"use client";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

import SignInForm from "@/components/SignInForm";

export default function Login() {
  const {status} = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [router, status]);

  if (status === "loading") return <div>Loading...</div>;

  return <SignInForm />;
}
