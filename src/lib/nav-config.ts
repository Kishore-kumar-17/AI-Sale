import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Users, ListChecks, Settings } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

// Meetings (Phase 5) and Proposals (Phase 6) live inside each lead's detail page rather
// than as standalone routes. Add an entry here for future phases that do add their own
// top-level route.
export const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Leads", href: "/leads", icon: Users },
  { title: "Tasks", href: "/tasks", icon: ListChecks },
  { title: "Settings", href: "/settings", icon: Settings },
];
