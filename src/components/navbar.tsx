"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Inicio", href: "/" },
  // Agrega tus rutas aqui:
  // { label: "Albums", href: "/albums" },
  // { label: "Favoritos", href: "/favoritos" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-black/10 bg-white p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Immich on Steroids</h2>
      </div>

      <nav aria-label="Main navigation" className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-black text-white"
                  : "text-black/75 hover:bg-black/5 hover:text-black",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
