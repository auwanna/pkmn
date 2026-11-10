import { ThemeSwitcher } from "@/components/theme/switcher";
import { Separator } from "@/components/separator";
import { SidebarTrigger } from "@/components/sidebar";

export function AppHeader({ children }: { children: React.ReactNode }) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-2 px-3">
        <SidebarTrigger />
        <Separator className="mr-2 data-[orientation=vertical]:h-4" orientation="vertical" />
        {children}

        <div className="ml-auto">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
