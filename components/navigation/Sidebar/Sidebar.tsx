import Link from "next/link";
import { createSidebarSections } from "./utils";
import {
  Module,
  Package,
  Alias,
  Function,
  collectModuleItems,
  Struct,
} from "@/lib/docs";
import { SidebarLayout } from "@/components/navigation/Sidebar/SidebarLayout";
import { SidebarSection } from "./SidebarLayout";

type SidebarProps = {
  pkg: Package;
  activeModule?: Module;
};

function Sidebar({ pkg, activeModule }: SidebarProps) {
  if (activeModule) {
    // Module view - show module sections
    const sections = createSidebarSections(activeModule, pkg.name);

    return (
      <SidebarLayout>
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2">Index</h2>
          <div className="pl-4">
            <Link
              href={`/docs/packages/${pkg.name}`}
              className="block py-1 hover:text-primary"
            >
              ← Back to package
            </Link>
            <Link href="#overview" className="block py-1 hover:text-primary">
              Overview
            </Link>
            {sections.map(
              (section) =>
                section.items.length > 0 && (
                  <Link
                    key={section.title}
                    href={`#${section.title.toLowerCase()}`}
                    className="block py-1 hover:text-primary"
                  >
                    {section.title}
                  </Link>
                ),
            )}
          </div>
        </div>
        {sections.map(
          (section) =>
            section.items.length > 0 && (
              <SidebarSection
                key={section.title}
                title={section.title}
                items={section.items}
              />
            ),
        )}
      </SidebarLayout>
    );
  }

  // Package view - show modules with their sections
  const moduleItems = new Map(
    pkg.modules?.map((mod) => [mod.name, collectModuleItems(mod)]) ?? [],
  );

  return (
    <SidebarLayout>
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">Index</h2>
        <div className="pl-4">
          <Link href="#overview" className="block py-1 hover:text-primary">
            Overview
          </Link>
          {pkg.modules?.map((module) => (
            <Link
              key={module.name}
              href={`#${module.name}`}
              className="block py-1 hover:text-primary"
            >
              {module.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Module sections */}
      {pkg.modules?.map((module) => {
        const items = moduleItems.get(module.name);
        if (!items) return null;

        return (
          <div key={module.name} className="mb-8">
            <div className="flex items-center justify-between">
              <Link
                href={`/docs/packages/${pkg.name}/modules/${module.name}`}
                className="text-md font-semibold hover:text-primary"
              >
                {module.name}
              </Link>
            </div>
            <div className="mt-2 space-y-4">
              {/* Functions */}
              {items.functions.length > 0 && (
                <div>
                  <ul className="pl-4 space-y-1">
                    {items.functions.map((fn: Function) => (
                      <li
                        key={fn.name}
                        className="text-sm flex justify-between pr-4"
                      >
                        <Link
                          href={`#${module.name}-${fn.name}`}
                          className="hover:text-primary"
                        >
                          {fn.name}
                        </Link>
                        <span className="text-muted-foreground">Function</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Types */}
              {items.types.length > 0 && (
                <div>
                  <ul className="pl-4 space-y-1">
                    {items.types.map((type: Struct) => (
                      <li
                        key={type.name}
                        className="text-sm flex justify-between pr-4"
                      >
                        <Link
                          href={`#${module.name}-${type.name}`}
                          className="hover:text-primary"
                        >
                          {type.name}
                        </Link>
                        <span className="text-muted-foreground">Struct</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Constants */}
              {items.constants.length > 0 && (
                <div>
                  <ul className="pl-4 space-y-1">
                    {items.constants.map((constant: Alias) => (
                      <li key={constant.name} className="text-sm">
                        <Link
                          href={`#${module.name}-${constant.name}`}
                          className="hover:text-primary"
                        >
                          {constant.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Variables */}
              {items.variables.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Variables
                  </h4>
                  <ul className="pl-4 space-y-1">
                    {items.variables.map((variable) => (
                      <li key={variable.name} className="text-sm">
                        <Link
                          href={`#${module.name}-${variable.name}`}
                          className="hover:text-primary"
                        >
                          {variable.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </SidebarLayout>
  );
}

// Helper type guard
function isModule(item: Package | Module): item is Module {
  return !("modules" in item);
}

export default Sidebar;
