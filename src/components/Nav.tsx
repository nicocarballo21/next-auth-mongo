"use client";
import {Button} from "@nextui-org/react";
import {signIn, signOut, useSession} from "next-auth/react";
import Link from "next/link";
import React from "react";

export default function Nav() {
  const {data: session} = useSession();

  return (
    <nav className="flex w-full justify-between bg-purple-400 px-5 py-2">
      <Link href="/">
        <Button size="sm">{`<-- Back to index`}</Button>
      </Link>
      <div className="flex items-center gap-2">
        <Link href="/dashboard">
          <Button fullWidth color="secondary" size="sm">
            Dashboard
          </Button>
        </Link>

        {!session ? (
          <>
            <Link href="/auth/register">
              <Button fullWidth color="secondary" size="sm">
                Register
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button fullWidth color="secondary" size="sm">
                Sign in
              </Button>
            </Link>
            <Button fullWidth color="secondary" size="sm" onClick={() => signIn("github")}>
              Sign in with github
            </Button>
          </>
        ) : (
          <>
            <span className="rounded-md bg-green-200 p-2 text-sm text-black">
              {session.user?.name}
            </span>
            <span className="rounded-md bg-green-200 p-2 text-sm text-black">
              {session.user?.email}
            </span>
            <Link href="/api/auth/signout">
              <Button fullWidth color="danger" size="sm" onClick={() => signOut()}>
                Logout
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
