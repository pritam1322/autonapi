
import { ConsumerSidebar } from "@/components/sidebar/ConsumerSideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/wrappers/theme-provider";
import { Provider } from "@/lib/reactQuery-provider";
import SessionWrapper from "@/lib/SessionWrapper";
import type { Metadata } from "next";
import { useSession } from "next-auth/react";
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
                
                <SidebarProvider>
                  <div className="md:hidden"><SidebarTrigger /></div>
                  <ConsumerSidebar />
                    <div className="hidden md:block"><SidebarTrigger /></div>
                    <div className="flex w-full mx-auto">
                      {children}
                    </div>
                  </SidebarProvider>
              </ThemeProvider>
            </Provider>
         </SessionWrapper>       
      </body>
    </html>
  );
}
