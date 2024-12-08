import {
  Package,
  Module,
  collectModuleItems,
  getAllPackages,
  isModule,
  ModuleItems,
} from "@/lib/docs";
import { SidebarItemTypeOnly } from "./types";

type SidebarSection = {
  title: string;
  items: Array<{
    name: string;
    href: string;
    label?: string;
  }>;
};

export function createSidebarSections(
  item: Package | Module,
  packageName?: string,
): SidebarSection[] {
  if (isModule(item)) {
    const items = collectModuleItems(item);
    // If packageName is provided, use the new URL structure
    const baseHref = packageName
      ? `/docs/packages/${packageName}/modules/${item.name}`
      : `/docs/modules/${item.name}`;

    return [
      {
        title: "Functions",
        items: items.functions.map((fn) => ({
          ...fn,
          href: `${baseHref}#${fn.name}`,
        })),
      },
      {
        title: "Types",
        items: items.types.map((type) => ({
          ...type,
          href: `${baseHref}#${type.name}`,
        })),
      },
      {
        title: "Constants",
        items: items.constants.map((constant) => ({
          ...constant,
          href: `${baseHref}#${constant.name}`,
        })),
      },
      {
        title: "Variables",
        items: items.variables.map((variable) => ({
          ...variable,
          href: `${baseHref}#${variable.name}`,
        })),
      },
    ];
  }

  if (item.name === "Default") {
    return createDefaultPackageSections(item);
  }

  // For packages, create sections for modules
  return [
    ...(item.packages?.length
      ? [
          {
            title: "Packages",
            items: item.packages.map((p) => ({
              name: p.name,
              label: p.name,
              href: `/docs/packages/${p.name}`,
            })),
          },
        ]
      : []),
    ...(item.modules?.length
      ? [
          {
            title: "Modules",
            items: item.modules.map((m) => ({
              name: m.name,
              label: m.name,
              href: `/docs/packages/${item.name}/modules/${m.name}`,
            })),
          },
        ]
      : []),
  ];
}

function findPackagePath(name: string): string {
  const packages = getAllPackages();

  for (const pkg of packages) {
    if (pkg.package.name === name) {
      return "/docs" + pkg.path;
    }
  }
  return "";
}

function collectAllItems(pkg: Package) {
  const items = {
    constants: [] as SidebarItemTypeOnly[],
    variables: [] as SidebarItemTypeOnly[],
    functions: [] as SidebarItemTypeOnly[],
    types: [] as SidebarItemTypeOnly[],
  };

  pkg.modules?.forEach((module) => {
    module.functions?.forEach((fn) => {
      items.functions.push({
        name: fn.name,
        module: module.name,
        type: "function",
      });
    });

    module.structs?.forEach((struct) => {
      items.types.push({
        name: struct.name,
        module: module.name,
        type: "struct",
      });
    });

    module.aliases?.forEach((alias) => {
      if (alias.value?.includes("const")) {
        items.constants.push({
          name: alias.name,
          module: module.name,
          type: "const",
        });
      } else {
        items.variables.push({
          name: alias.name,
          module: module.name,
          type: "var",
        });
      }
    });
  });

  return items;
}

function createDefaultPackageSections(pkg: Package) {
  const moduleItems = new Map<string, ModuleItems>();

  pkg.modules?.forEach((module) => {
    const items = collectModuleItems(module);
    moduleItems.set(module.name, items);
  });

  return Array.from(moduleItems.entries())
    .sort(([, a], [, b]) => {
      const aVarCount = a.variables.length;
      const bVarCount = b.variables.length;
      if (aVarCount !== bVarCount) return aVarCount - bVarCount;

      const getTotal = (items: ModuleItems) =>
        Object.values(items).reduce((acc, curr) => acc + curr.length, 0);

      return getTotal(a) - getTotal(b);
    })
    .map(([moduleName, items]) => ({
      title: moduleName,
      items: [
        ...items.functions.map((fn) => ({
          ...fn,
          module: moduleName,
          href: `#${fn.name}`,
        })),
        ...items.types.map((type) => ({
          ...type,
          module: moduleName,
          href: `#${type.name}`,
        })),
        ...items.constants.map((constant) => ({
          ...constant,
          module: moduleName,
          href: `#${constant.name}`,
        })),
        ...items.variables.map((variable) => ({
          ...variable,
          module: moduleName,
          href: `#${variable.name}`,
        })),
      ],
    }));
}
