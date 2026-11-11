import { createRootRouteWithContext, HeadContent, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AppFooter } from "@/components/app-footer";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/sidebar";
import { TooltipProvider } from "@/components/tooltip";
import type { QueryClient } from "@tanstack/react-query";

import logo from "@/assets/images/icon.png";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    links: [
      {
        rel: "icon",
        href: logo,
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <div className="pkmn-root font-sans antialiased">
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <Outlet />
              <AppFooter />
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
      </div>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
