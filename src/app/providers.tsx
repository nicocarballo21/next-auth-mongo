"use client";

import type {ReactNode} from "react";
import type {Session} from "next-auth";

import {NextUIProvider} from "@nextui-org/react";
import {SessionProvider} from "next-auth/react";

export function Providers({
  children,
  authSession,
}: {
  children: ReactNode;
  authSession: Session | null;
}) {
  return (
    <NextUIProvider>
      <SessionProvider session={authSession}>{children}</SessionProvider>
    </NextUIProvider>
  );
}
