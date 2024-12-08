import Link from "next/link";
import { SidebarItem } from "./types";

export const SidebarSection = ({
  title,
  items,
}: {
  title: string;
  items: SidebarItem[];
}) => (
  <div className="mb-6">
    <h3 className="font-semibold mb-3 text-muted-foreground">
      {title} ({items.length})
    </h3>
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={`${item.module || ""}-${item.name}`} className="flex">
          <Link
            href={item.href}
            className="text-sm hover:text-primary font-mono truncate max-w-full inline-block relative z-10"
            title={item.description}
          >
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export const SidebarLayout = ({ children }: { children: React.ReactNode }) => (
  <aside className="md:w-1/5 w-full ml-4 fixed top-16 left-0 bottom-0 overflow-y-auto">
    <nav className="p-4 h-full relative">
      {children}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </nav>
  </aside>
);
