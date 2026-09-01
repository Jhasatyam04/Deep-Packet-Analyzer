import {
  Globe,
  HelpCircle,
  Lock,
  Music2,
  Play,
  Search,
  Server,
  Share2,
  Github,
  type LucideIcon,
} from "lucide-react";

export const APP_COLORS: Record<string, string> = {
  YouTube: "var(--color-app-youtube)",
  Google: "var(--color-app-google)",
  HTTPS: "var(--color-app-https)",
  Facebook: "var(--color-app-facebook)",
  GitHub: "var(--color-app-github)",
  DNS: "var(--color-app-dns)",
  HTTP: "var(--color-app-http)",
  TikTok: "var(--color-app-tiktok)",
  Unknown: "var(--color-app-unknown)",
};

export const APP_ICONS: Record<string, LucideIcon> = {
  YouTube: Play,
  Google: Search,
  HTTPS: Lock,
  Facebook: Share2,
  GitHub: Github,
  DNS: Server,
  HTTP: Globe,
  TikTok: Music2,
  Unknown: HelpCircle,
};

export function appColor(name: string): string {
  return APP_COLORS[name] ?? "var(--color-app-unknown)";
}

export function appIcon(name: string): LucideIcon {
  return APP_ICONS[name] ?? HelpCircle;
}

export const RULE_TYPE_LABEL: Record<string, string> = {
  ip: "IP",
  application: "Application",
  domain: "Domain",
};
