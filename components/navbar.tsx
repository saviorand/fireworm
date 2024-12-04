import Link from "next/link";
import Image from "next/image";
import { Github, Book, Box } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import SearchBar from "./searchbar";
import docsConfig from '@/docs.config.json'

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image src={docsConfig.logoPath} alt={docsConfig.projectName} width={40} height={40} />
      <span className="text-lg font-medium text-primary/90">{docsConfig.projectName}</span>
    </Link>
  );
}

function GitHubLink() {
  return (
    <Link
      href={docsConfig.repositoryURL}
      className="flex items-center gap-2 rounded-md p-2.5 mx-2 text-sm font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Github className="h-5 w-5" />
      <span className="hidden md:inline">GitHub</span>
    </Link>
  );
}

function PackagesLink() {
  return (
    <Link href="/docs/packages" className="flex items-center gap-2 rounded-md p-2.5 mx-2 text-sm font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-700">
      <Box className="h-5 w-5" />
      <span className="hidden md:inline">Packages</span>
    </Link>
  );
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full shadow-sm border-b bg-white dark:bg-black">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Logo />
        <div className="flex items-center gap-2">
          <PackagesLink />
          <GitHubLink />
          <SearchBar />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
