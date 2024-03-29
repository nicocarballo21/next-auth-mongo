import type {Metadata} from "next";
import type {ReactNode} from "react";

import {Inter} from "next/font/google";
import {Button} from "@nextui-org/react";
import Link from "next/link";

import "./globals.css";

import {getServerSession} from "next-auth";

import Nav from "@/components/Nav";

import {Providers} from "./providers";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({children}: Readonly<{children: ReactNode}>) {
  const session = await getServerSession();

  return (
    <html className="dark" lang="en">
      <body className={inter.className}>
        <Providers authSession={session}>
          <Nav />
          <main className="mx-auto size-full max-w-7xl flex-1 flex-col items-center gap-10 px-2 py-10 lg:px-14 2xl:px-0">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
