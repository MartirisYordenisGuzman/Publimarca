import React from "react";
import { Link } from "@/i18n/routing";

export default function LocaleNotFound() {
  return (
    <main className="min-h-screen bg-[#FBFBF9] flex flex-col items-center justify-center px-6 text-center">
      <span className="text-xs font-mono uppercase tracking-widest text-[#A01318] mb-3">
        404 // Archive Node Not Found
      </span>
      <h1 className="font-display text-3xl sm:text-5xl font-bold uppercase text-[#101014] mb-4">
        Page Not Found
      </h1>
      <p className="text-sm text-[#52525B] max-w-md mb-8">
        The requested studio dispatch or archive route does not exist.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-full bg-[#101014] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#A01318] transition-colors"
      >
        Return to Studio Index
      </Link>
    </main>
  );
}
