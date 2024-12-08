import Link from "next/link";
import Image from "next/image";
import { Github, Book, Box } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";
import SearchBar from "./SearchBar";
import docsConfig from "@/docs.config.json";

import { ReactNode } from "react";

function NavLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium 
        transition-colors hover:bg-gray-100 dark:hover:bg-gray-800
        border-b-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700"
      {...(external && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
    >
      {children}
    </Link>
  );
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src={docsConfig.logoPath}
        alt={docsConfig.projectName}
        width={40}
        height={40}
      />
      <span className="text-lg font-medium text-primary/90 hidden md:block">
        {docsConfig.projectName}
      </span>
    </Link>
  );
}

function NavLinks() {
  return (
    <nav className="flex items-center gap-1 mr-8 lg:mr-0">
      <NavLink href="/docs/packages">
        <Box className="h-5 w-5" />
        <span className="hidden md:inline">Packages</span>
      </NavLink>

      <NavLink href={docsConfig.repositoryURL} external>
        <Github className="h-5 w-5" />
        <span className="hidden md:inline">GitHub</span>
      </NavLink>

      <SearchBar />

      <div>
        <ThemeToggle />
      </div>
    </nav>
  );
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-black/80">
      <div className="container flex h-14 items-center justify-between">
        <Logo />
        <NavLinks />
      </div>
    </header>
  );
}
