import { getAllPackages, Package } from "@/lib/docs";
import Link from "next/link";
import { AliasWithModule, FunctionWithModule, StructWithModule } from "@/lib/docs";

type Item = {
  name: string;
  module: string;
  type: string;
};

const packages = getAllPackages();

function findPackagePath(name: string): string {
  for (const pkg of packages) {
    if (pkg.package.name === name) {
      return "/docs" + pkg.path;
    }
  }
  return "";
}

function collectAllItems(pkg: Package) {
  const items = {
    constants: [] as Item[],
    variables: [] as Item[],
    functions: [] as Item[],
    types: [] as Item[],
  };

  pkg.modules?.forEach((module) => {
    module.functions?.forEach((fn) => {
      items.functions.push({
        name: fn.name,
        module: module.name,
        type: 'function',
      });
    });

    module.structs?.forEach((struct) => {
      items.types.push({
        name: struct.name,
        module: module.name,
        type: 'struct',
      });
    });

    module.aliases?.forEach((alias) => {
      if (alias.value?.includes('const')) {
        items.constants.push({
          name: alias.name,
          module: module.name,
          type: 'const',
        });
      } else {
        items.variables.push({
          name: alias.name,
          module: module.name,
          type: 'var',
        });
      }
    });
  });

  return items;
}
type ModuleItems = {
  constants: AliasWithModule[];
  variables: AliasWithModule[];
  functions: FunctionWithModule[];
  types: StructWithModule[];
};

type SidebarSection = {
  title: string;
  items: Array<{ name: string; module?: string; href: string }>;
};

const ItemList = ({ title, items }: { title: string; items: SidebarSection['items'] }) => (
  <div className="mb-6">
    <h2 className="text-lg font-bold mb-2">{title}</h2>
    <div className="pl-4">
      {items.map((item) => (
        <Link
          key={`${item.module || ''}-${item.name}`}
          href={item.href}
          className="block py-1 hover:text-primary font-mono text-sm"
        >
          {item.name}
        </Link>
      ))}
    </div>
  </div>
);

const ModuleSection = ({ 
  name, 
  items 
}: { 
  name: string; 
  items: ModuleItems;
}) => (
  <div className="mb-8">
    <h2 className="text-lg font-bold mb-2">{name}</h2>
    <div className="pl-4">
      {Object.entries(items).map(([type, typeItems]) => 
        typeItems.length > 0 && (
          <div key={type} className="mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </h3>
            <div className="pl-2">
              {typeItems.map((item) => (
                <Link
                  key={`${item.module}-${item.name}`}
                  href={`#${item.name}`}
                  className="block py-1 hover:text-primary font-mono text-sm"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  </div>
);

const SidebarLayout = ({ children }: { children: React.ReactNode }) => (
  <aside className="w-1/5 fixed top-16 left-0 bottom-0 overflow-y-auto border-r">
    <nav className="p-4 h-full relative">
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      {children}
    </nav>
  </aside>
);

export default function Sidebar({ pkg }: { pkg: Package }) {
  if (pkg.name === "Default") {
    const moduleItems = new Map<string, ModuleItems>();

    pkg.modules?.forEach((module) => {
      const items: ModuleItems = {
        constants: [],
        variables: [],
        functions: [],
        types: [],
      };

      module.functions?.forEach((fn) => 
        items.functions.push({ ...fn, module: module.name }));
      module.structs?.forEach((struct) => 
        items.types.push({ ...struct, module: module.name }));
      module.aliases?.forEach((alias) => {
        if (alias.value?.includes('const')) {
          items.constants.push({ ...alias, module: module.name });
        } else {
          items.variables.push({ ...alias, module: module.name });
        }
      });

      moduleItems.set(module.name, items);
    });

    return (
      <SidebarLayout>
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2">Index</h2>
          <div className="pl-4">
            <Link href="#overview" className="block py-1 hover:text-primary">
              Overview
            </Link>
          </div>
        </div>

        {Array.from(moduleItems.entries())
          .sort(([, a], [, b]) => {
            const aVarCount = a.variables.length;
            const bVarCount = b.variables.length;
            if (aVarCount !== bVarCount) return aVarCount - bVarCount;
            
            const getTotal = (items: ModuleItems) => 
              Object.values(items).reduce((acc, curr) => acc + curr.length, 0);
            
            return getTotal(a) - getTotal(b);
          })
          .map(([moduleName, items]) => (
            <ModuleSection key={moduleName} name={moduleName} items={items} />
          ))}
      </SidebarLayout>
    );
  }

  const items = collectAllItems(pkg);
  const sections: SidebarSection[] = [
    {
      title: 'Index',
      items: [
        { name: 'Overview', href: '#' },
        ...(items.functions.length ? [{ name: 'Functions', href: '#functions' }] : []),
        ...(items.types.length ? [{ name: 'Types', href: '#types' }] : []),
        ...(items.constants.length ? [{ name: 'Constants', href: '#constants' }] : []),
        ...(items.variables.length ? [{ name: 'Variables', href: '#variables' }] : []),
      ]
    },
    ...(pkg.packages?.length ? [{
      title: 'Packages',
      items: pkg.packages.map(p => ({ 
        name: p.name, 
        href: findPackagePath(p.name) 
      }))
    }] : []),
    ...(items.functions.length ? [{
      title: 'Functions',
      items: items.functions.map(item => ({ 
        name: item.name, 
        module: item.module, 
        href: `#${item.name}` 
      }))
    }] : []),
    ...(items.types.length ? [{
      title: 'Types',
      items: items.types.map(item => ({ 
        name: item.name, 
        module: item.module, 
        href: `#${item.name}` 
      }))
    }] : []),
    ...(items.constants.length ? [{
      title: 'Constants',
      items: items.constants.map(item => ({ 
        name: item.name, 
        module: item.module, 
        href: `#${item.name}` 
      }))
    }] : []),
    ...(items.variables.length ? [{
      title: 'Variables',
      items: items.variables.map(item => ({ 
        name: item.name, 
        module: item.module, 
        href: `#${item.name}` 
      }))
    }] : []),
  ];

  return (
    <SidebarLayout>
      {sections.map((section, index) => (
        <ItemList key={index} title={section.title} items={section.items} />
      ))}
    </SidebarLayout>
  );
}

