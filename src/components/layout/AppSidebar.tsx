import {
  LayoutDashboard,
  Package,
  FolderTree,
  Building2,
  Tag,
  Megaphone,
  Bell,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Products", url: "/products", icon: Package },
  { title: "Categories", url: "/categories", icon: FolderTree },
  { title: "Branches", url: "/branches", icon: Building2 },
  { title: "Brands", url: "/brands", icon: Tag },
  { title: "Promotions", url: "/promotions", icon: Megaphone },
  { title: "Notifications", url: "/notifications", icon: Bell },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { logout } = useAuth();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarContent>
        <div className="px-3 py-4">
          {!isCollapsed && (
            <div className="flex items-center gap-2 px-2 mb-6">
              <img
                src="/MahajanaSuper.jpg"
                alt="Mahajana Super"
                className="h-12 w-12 rounded-lg object-cover"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-sidebar-foreground">
                  Mahajana Super
                </span>
                <span className="text-xs text-sidebar-foreground/70">
                  Admin Panel
                </span>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center mb-6">
              <img
                src="/MahajanaSuper.jpg"
                alt="Mahajana Super"
                className="h-12 w-12 rounded-lg object-cover"
              />
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink
                    to={item.url}
                    end={item.url === "/"}
                    className={({ isActive }) =>
                      `flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-smooth ${
                        isActive
                          ? "bg-primary text-primary-foreground font-medium"
                          : "!text-black dark:!text-white hover:bg-sidebar-accent hover:!text-black dark:hover:!text-white"
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          className="w-full justify-start text-black dark:text-white hover:bg-sidebar-accent transition-smooth"
          size={isCollapsed ? "icon" : "default"}
          onClick={logout}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
