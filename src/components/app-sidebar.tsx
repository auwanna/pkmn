import { IconCards, IconPokeball, IconSearch } from "@tabler/icons-react";
import { Link } from "@/components/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/sidebar";
import { DEFAULT_SEARCH_PARAMS } from "@/lib/requests";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link to="/" />}
              className="rounded-sm justify-start gap-0 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="order-last flex aspect-square items-center justify-center text-sidebar-primary group-data-[state=collapsed]:size-8">
                .
              </div>
              <span className="font-bold font-display text-xl">PKMN</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Pokédex"
                render={<Link to="/" />}
                className="justify-start"
              >
                <IconPokeball />
                <span>Pokédex</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="grid flex-1 py-2">
            <span className="truncate">Pokémon Trading Card Game</span>
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Search"
                render={<Link to="/search" search={DEFAULT_SEARCH_PARAMS} />}
                className="justify-start"
              >
                <IconSearch />
                <span>Search</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Sets"
                render={<Link to="/sets" />}
                className="justify-start"
              >
                <IconCards />
                <span>Sets</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
