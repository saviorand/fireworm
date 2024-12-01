import { getAllPackages } from "@/lib/docs";
import Link from "next/link";

function collectAllItems(packages: any[]) {
  const allItems = new Map<string, {
    constants: any[];
    variables: any[];
    functions: any[];
    types: any[];
    description: string;
    moduleItems?: Map<string, {
      constants: any[];
      variables: any[];
      functions: any[];
      types: any[];
      description: string;
    }>;
  }>();

  packages.forEach((pkgData) => {
    const pkg = pkgData.package;
    const items = {
      constants: [] as any[],
      variables: [] as any[],
      functions: [] as any[],
      types: [] as any[],
      description: pkg.description || "",
      moduleItems: pkg.name === "Default" ? new Map() : undefined
    };

    pkg.modules?.forEach((module: any) => {
      if (pkg.name === "Default") {
        const moduleItems = {
          constants: [] as any[],
          variables: [] as any[],
          functions: [] as any[],
          types: [] as any[],
          description: module.description || ""
        };

        module.functions?.forEach((fn: any) => {
          moduleItems.functions.push({
            name: fn.name,
            module: module.name,
            type: 'function',
            description: fn.overloads?.[0]?.description || "",
          });
        });

        module.structs?.forEach((struct: any) => {
          moduleItems.types.push({
            name: struct.name,
            module: module.name,
            type: 'struct',
            description: struct.description || "",
          });
        });

        module.aliases?.forEach((alias: any) => {
          if (alias.value?.includes('const')) {
            moduleItems.constants.push({
              name: alias.name,
              module: module.name,
              type: 'const',
              description: alias.description || "",
            });
          } else {
            moduleItems.variables.push({
              name: alias.name,
              module: module.name,
              type: 'var',
              description: alias.description || "",
            });
          }
        });

        items.moduleItems?.set(module.name, moduleItems);
      } else {
        module.functions?.forEach((fn: any) => {
          items.functions.push({
            name: fn.name,
            module: module.name,
            type: 'function',
            description: fn.overloads?.[0]?.description || "",
          });
        });

        module.structs?.forEach((struct: any) => {
          items.types.push({
            name: struct.name,
            module: module.name,
            type: 'struct',
            description: struct.description || "",
          });
        });

        module.aliases?.forEach((alias: any) => {
          if (alias.value?.includes('const')) {
            items.constants.push({
              name: alias.name,
              module: module.name,
              type: 'const',
              description: alias.description || "",
            });
          } else {
            items.variables.push({
              name: alias.name,
              module: module.name,
              type: 'var',
              description: alias.description || "",
            });
          }
        });
      }
    });

    allItems.set(pkg.name, items);
  });

  return allItems;
}

export default function AllPackages() {
  const packages = getAllPackages();
  const allItems = collectAllItems(packages);

  const ItemList = ({ items, href, title }: {
    items: any[],
    href: string,
    title: string
  }) => (
    <div className="relative">
      <h3 className="font-semibold mb-3 text-muted-foreground">
        {title} ({items.length})
      </h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.name} className="flex w-fit">
            <Link
              href={href + '#' + item.name}
              className="text-sm hover:text-primary font-mono truncate inline-block relative z-10"
              title={item.description}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">All Packages</h1>

      <div className="grid grid-cols-1 gap-12">
        {Array.from(allItems.entries()).map(([pkgName, items]) => (
          <section
            key={pkgName}
            className={`border rounded-lg p-6 relative ${pkgName !== 'Default' ? 'hover:border-primary transition-colors group' : ''
              }`}
          >
            {pkgName !== 'Default' && (
              <Link
                href={`/docs/packages/${pkgName}`}
                className="absolute inset-0 z-10"
                aria-label={`Go to ${pkgName} package`}
              />
            )}

            <div className="relative">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {pkgName}
                </h2>
                <p className="text-muted-foreground">{items.description}</p>
              </div>

              {pkgName === "Default" ? (
                <div className="space-y-8">
                  {Array.from(items.moduleItems?.entries() || [])
                    .sort((a, b) => {
                      const aVarCount = a[1].variables.length;
                      const bVarCount = b[1].variables.length;
                      if (aVarCount !== bVarCount) {
                        return aVarCount - bVarCount;
                      }

                      const aTotalItems =
                        a[1].functions.length +
                        a[1].types.length +
                        a[1].constants.length +
                        a[1].variables.length;
                      const bTotalItems =
                        b[1].functions.length +
                        b[1].types.length +
                        b[1].constants.length +
                        b[1].variables.length;
                      return aTotalItems - bTotalItems;
                    })
                    .map(([moduleName, moduleItems]) => (
                      <div key={moduleName} className="border-t pt-6">
                        <h3 className="text-xl font-semibold mb-4 group relative">
                          <Link
                            href={`/docs/modules/${moduleName}`}
                            className="hover:text-primary transition-colors inline-flex items-center"
                          >
                            {moduleName}
                            <span className="text-sm text-muted-foreground ml-2">
                              ({moduleItems.functions.length + moduleItems.types.length +
                                moduleItems.constants.length + moduleItems.variables.length} items)
                            </span>
                          </Link>
                        </h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {moduleItems.functions.length > 0 && (
                            <ItemList
                              items={moduleItems.functions}
                              href={`/docs/modules/${moduleName}`}
                              title="Functions"
                            />
                          )}
                          {moduleItems.types.length > 0 && (
                            <ItemList
                              items={moduleItems.types}
                              href={`/docs/modules/${moduleName}`}
                              title="Types"
                            />
                          )}
                          {moduleItems.constants.length > 0 && (
                            <ItemList
                              items={moduleItems.constants}
                              href={`/docs/modules/${moduleName}`}
                              title="Constants"
                            />
                          )}
                          {moduleItems.variables.length > 0 && (
                            <ItemList
                              items={moduleItems.variables}
                              href={`/docs/modules/${moduleName}`}
                              title="Variables"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <ItemList
                    items={items.functions}
                    href={`/docs/packages/${pkgName}`}
                    title="Functions"
                  />
                  <ItemList
                    items={items.types}
                    href={`/docs/packages/${pkgName}`}
                    title="Types"
                  />
                  {items.constants.length > 0 && (
                    <ItemList
                      items={items.constants}
                      href={`/docs/packages/${pkgName}`}
                      title="Constants"
                    />
                  )}
                  {items.variables.length > 0 && (
                    <ItemList
                      items={items.variables}
                      href={`/docs/packages/${pkgName}`}
                      title="Variables"
                    />
                  )}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
