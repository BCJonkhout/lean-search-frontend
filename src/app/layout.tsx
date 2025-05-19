import "@/css/satoshi.css";
import "@/css/style.css";

import { Sidebar } from "@/components/Layouts/sidebar";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import { Header } from "@/components/Layouts/header";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    template: "Symbol | Lean Management",
    default: "Symbol | Lean Management",
  },
  description:
    "Lean management chat",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
      <html lang="en" suppressHydrationWarning>
      <head>
          <link
              rel="icon"
              type="image/png"
              href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAJ1BMVEVHcEwpKX4pKX8pKX4pKX4qKn8qKn8qKn4qKn8pKX8qKn8pKX8qKn97unAFAAAADHRSTlMAFidYQJmGbt+s9L6So5X7AAAAjElEQVQokX2SSQ4AIQgEwX37/3tnFEyEiHW0VGgR4AAn7gdB4XsbmywVlnGg5Bi2rC+5lmJwjGjILadbZMKU3pA4ZTEkrCDdkJ66DHfLWerdRo54byuwNSrX92GeS3pWNrqmyu0u6Zmto3SzURXySxadxnkmR0pz7k7yl8i5KyknK6V63UOWqDPiRi5/z2oKux8hgIgAAAAASUVORK5CYII="
          />
      </head>
      <body>
      <Providers>
          <NextTopLoader color="#5750F1" showSpinner={false}/>

          <div className="flex min-h-screen">
              <Sidebar/>

              <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
                  <Header/>

                  <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
                      {children}
                  </main>
              </div>
          </div>
      </Providers>
      </body>
      </html>
  );
}
