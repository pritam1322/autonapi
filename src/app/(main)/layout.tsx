import Headers from "@/components/landingpages/Headers";
import { ThemeProvider } from "@/components/wrappers/theme-provider";
import { Provider } from "@/lib/reactQuery-provider";
import SessionWrapper from "@/lib/SessionWrapper";
import type { Metadata } from "next";
import { Toaster } from "sonner";

import "./globals.css";



export const metadata: Metadata = {
  title: "AutonAPI",
  description: "API for Agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
         <SessionWrapper >
            <Provider>
              <Toaster />
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >
                
                <Headers />
                {children}
              </ThemeProvider>
            </Provider>
         </SessionWrapper>       
      </body>
    </html>
  );
}
