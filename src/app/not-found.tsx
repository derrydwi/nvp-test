import { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "404 Not Found",
};

export default function NotFound() {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-2">
      <h2 className="text-2xl font-bold">404</h2>
      <p>This page could not be found.</p>
      <Link href="/" className={buttonVariants({ variant: "ghost" })}>
        Return home
      </Link>
    </div>
  );
}
