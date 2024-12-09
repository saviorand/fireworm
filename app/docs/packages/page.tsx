import { getAllPackages, collectAllItems } from "@/lib/docs";
import Link from "next/link";

type ItemType = {
  name: string;
  description: string;
};

type ModuleItems = {
  functions: ItemType[];
  types: ItemType[];
  constants: ItemType[];
  variables: ItemType[];
};

type PackageData = {
  description: string;
  moduleItems?: Map<string, ModuleItems>;
  functions: ItemType[];
  types: ItemType[];
  constants: ItemType[];
  variables: ItemType[];
};

export default function AllPackages() {
  const packages = getAllPackages();
  const allItems = collectAllItems(packages);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        <header className="border-b pb-6">
          <h1 className="text-4xl font-bold tracking-tight">All Packages</h1>
          <p className="mt-2 text-muted-foreground">
            Browse all available packages and their components
          </p>
        </header>

        <div className="grid gap-8">
          {Array.from(allItems.entries()).map(([pkgName, items]) => (
            <PackageCard key={pkgName} pkgName={pkgName} items={items} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PackageCard({
  pkgName,
  items,
}: {
  pkgName: string;
  items: PackageData;
}) {
  const basePath =
    pkgName === "Default"
      ? "/docs/packages/default"
      : `/docs/packages/${pkgName}`;

  return (
    <section className="bg-card rounded-lg border shadow-sm">
      <div className="p-6 space-y-6">
        <div className="relative">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">{pkgName}</h2>
            <Link
              href={`/docs/packages/${pkgName}`}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              View Details →
            </Link>
          </div>
          <p className="mt-2 text-muted-foreground">{items.description}</p>
        </div>
        <div className="space-y-6">
          <ItemGrid items={items} basePath={basePath} />

          {items.moduleItems?.size && items.moduleItems?.size > 0 && (
            <div className="pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Modules</h3>
              <ModuleList
                modules={sortModules(Array.from(items.moduleItems.entries()))}
                basePath={basePath}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ItemGrid({
  items,
  basePath,
}: {
  items: PackageData;
  basePath: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <ItemList items={items.functions} href={basePath} title="Functions" />
      <ItemList items={items.types} href={basePath} title="Types" />
      <ItemList items={items.constants} href={basePath} title="Constants" />
      <ItemList items={items.variables} href={basePath} title="Variables" />
    </div>
  );
}

function ItemList({
  items,
  href,
  title,
}: {
  items: ItemType[];
  href: string;
  title: string;
}) {
  if (!items?.length) return null;

  return (
    <div className="bg-muted/50 rounded-lg p-4">
      <h4 className="font-medium text-sm flex items-center justify-between mb-3">
        <span>{title}</span>
        <span className="bg-muted-foreground/20 text-muted-foreground rounded-full px-2 py-0.5 text-xs">
          {items.length}
        </span>
      </h4>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.name}>
            <Link
              href={`${href}#${item.name}`}
              className="group flex items-center text-sm hover:text-primary transition-colors"
              title={item.description}
            >
              <code className="font-mono">{item.name}</code>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ModuleList({
  modules,
  basePath,
}: {
  modules: [string, ModuleItems][];
  basePath: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {modules.map(([moduleName, moduleItems]) => {
        const totalItems = Object.values(moduleItems).flat().length;

        return (
          <div
            key={moduleName}
            className="bg-muted/50 rounded-lg p-4 hover:bg-muted/70 transition-colors"
          >
            <Link
              href={`${basePath}/modules/${moduleName}`}
              className="flex items-center justify-between group"
            >
              <span className="font-medium group-hover:text-primary">
                {moduleName}
              </span>
              <span className="text-sm text-muted-foreground">
                {totalItems} items
              </span>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

function sortModules(moduleEntries: [string, ModuleItems][]) {
  return moduleEntries.sort((a, b) => {
    const [nameA, itemsA] = a;
    const [nameB, itemsB] = b;

    // Check if either module has a large section (e.g., > 10 items)
    const hasLargeSection = (items: ModuleItems) =>
      items.functions.length > 10 ||
      items.types.length > 10 ||
      items.constants.length > 10 ||
      items.variables.length > 10;

    const aHasLargeSection = hasLargeSection(itemsA);
    const bHasLargeSection = hasLargeSection(itemsB);

    // If one has a large section and the other doesn't, sort accordingly
    if (aHasLargeSection && !bHasLargeSection) return 1;
    if (!aHasLargeSection && bHasLargeSection) return -1;

    // If both have large sections or neither has, sort alphabetically
    return nameA.localeCompare(nameB);
  });
}
