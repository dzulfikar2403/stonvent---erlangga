import React, { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

const layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <SessionProvider>
            <SidebarProvider>
              <AppSidebar session={session} />
              <main className="w-full">
                <Navbar session={session} />

                <div className="px-4 py-2">{children}</div>
              </main>
            </SidebarProvider>
          </SessionProvider>
        </body>
      </html>
    </>
  );
};

export default layout;
