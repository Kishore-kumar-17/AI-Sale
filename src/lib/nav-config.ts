import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Users, Settings } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

// Add an entry here as each phase ships its route (Meetings in Phase 5,
// Proposals in Phase 6, etc). See docs/phases/.
export const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Leads", href: "/leads", icon: Users },
  { title: "Settings", href: "/settings", icon: Settings },
];
