"use client";

import Link from "next/link";
import { IconPhoto, IconSearch, IconMap, IconUser,IconUsers,
  IconHeart, IconAlbum, IconTags, IconFolder, IconTool,IconArchive, IconLock, IconTrash} from "@tabler/icons-react";
import { Button } from "@mantine/core";
import './navbar.css';
type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode | null;
};

const navItems: NavItem[] = [
  { label: "Fotos", href: "/Photos", icon: <IconPhoto size={14}/>},
  { label: "Explorar", href: "/Explore", icon: <IconSearch size={14}/>},
  { label: "Map", href: "/Map", icon: <IconMap size={14}/>},
  { label: "Personas", href: "/People", icon: <IconUser size={14}/> },
  { label: "Compartidos", href: "/Shared", icon: <IconUsers size={14}/> },
  { label: "Biblioteca", href: "#", icon: null },
  { label: "Favoritos", href: "/Library/Favorites", icon: <IconHeart size={14}/> },
  { label: "Albumes", href: "/Library/Albums", icon: <IconAlbum size={14}/> },
  { label: "Etiquetas", href: "/Library/Tags", icon: <IconTags size={14}/> },
  { label: "Carpetas", href: "/Library/Folders", icon: <IconFolder size={14}/> },
  { label: "Utilidades", href: "/Library/Utilities", icon: <IconTool size={14}/> },
  { label: "Archivo", href: "/Library/Archive", icon: <IconArchive size={14}/> },
  { label: "Carpeta protegida", href: "/Library/LockedFolder", icon: <IconLock size={14}/> },
  { label: "Papelera", href: "/Library/Trash", icon: <IconTrash size={14}/> },
];

export function Navbar() {
  return (
    <aside className="w-64 shrink-0 border-r border-[var(--mantine-color-default-border)] bg-[var(--mantine-color-body)] p-4">
      <nav aria-label="Main navigation" className="flex flex-col gap-2 align-items-start">
        {navItems.map((item) => {
          if(item.href === "#"){
            return (
              <div key={item.label} className="px-3 py-2 text-sm font-semibold text-[var(--mantine-color-dimmed)]">
                {item.label}
              </div>
            );
          }
          return (
           <Button key={item.href} leftSection={item.icon} variant="subtle"
            component={Link} href={item.href} fullWidth className="flex" color="white">
            {item.label}
           </Button>
          );
        })}
      </nav>
    </aside>
  );
}
