import React from "react";
import { Package, collectModuleItems } from "@/lib/docs";
import LayoutWithSidebar from "@/components/navigation/LayoutWithSidebar";
import Link from "next/link";
import StructCard from "../cards/StructCard";
import AliasCard from "../cards/AliasCard";
import FunctionDoc from "../cards/FunctionCard";
import TraitCard from "../cards/TraitCard";

function PackageView(pkg: Package, crumbs: React.ReactNode) {
  const moduleItems = new Map(
    pkg.modules?.map((mod) => [mod.name, collectModuleItems(mod)]) ?? [],
  );

  return (
    <LayoutWithSidebar pkg={pkg} crumbs={crumbs}>
      <div id="overview" className="space-y-12 scroll-mt-20">
        <section>
          <h1 className="text-3xl font-bold mb-8">{pkg.name}</h1>
          {pkg.description && (
            <p className="text-muted-foreground mb-8">{pkg.description}</p>
          )}
        </section>

        {/* Modules Section */}
        {moduleItems.size > 0 && (
          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-8">Modules</h2>
            <div className="space-y-16">
              {Array.from(moduleItems.entries()).map(([modName, items]) => {
                const totalItems = Object.values(items).reduce(
                  (acc, curr) => acc + curr.length,
                  0,
                );

                return (
                  <div
                    key={modName}
                    id={modName}
                    className="space-y-6 scroll-mt-20"
                  >
                    <div className="border-l-2 pl-6">
                      <Link
                        href={`/docs/packages/${pkg.name}/modules/${modName}`}
                        className="group"
                      >
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-primary">
                          {modName}
                        </h3>
                        <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                          {items.functions.length > 0 && (
                            <span>{items.functions.length} functions</span>
                          )}
                          {items.types.length > 0 && (
                            <span>{items.types.length} types</span>
                          )}
                          {items.constants.length > 0 && (
                            <span>{items.constants.length} constants</span>
                          )}
                          {items.variables.length > 0 && (
                            <span>{items.variables.length} variables</span>
                          )}
                        </div>
                      </Link>

                      {/* Functions */}
                      {items.functions.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold mb-4">
                            Functions
                          </h4>
                          <div className="grid grid-cols-1 ">
                            {items.functions.map((fn) => (
                              <FunctionDoc
                                key={fn.name}
                                func={fn}
                                pkg={pkg.name}
                                modName={modName}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Types */}
                      {items.types.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold mb-4">Types</h4>
                          <div className="grid gap-4">
                            {items.types.map((type) => (
                              <StructCard
                                key={type.name}
                                struct={type}
                                pkg={pkg.name}
                                modName={modName}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Constants */}
                      {items.constants.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold mb-4">
                            Constants
                          </h4>
                          <div className="grid gap-4">
                            {items.constants.map((constant) => (
                              <div
                                key={constant.name}
                                className="p-4 bg-muted rounded-lg"
                              >
                                <Link
                                  href={`/docs/packages/${pkg.name}/modules/${modName}#${constant.name}`}
                                  className="font-mono font-medium hover:text-primary"
                                >
                                  {constant.name}
                                </Link>
                                {constant.description && (
                                  <p className="mt-2 text-sm text-muted-foreground">
                                    {constant.description}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Aliases */}
                      {items.variables.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold mb-4">
                            Aliases
                          </h4>
                          <div className="grid gap-4">
                            {items.variables.map((variable) => (
                              <AliasCard
                                alias={variable}
                                pkg={pkg.name}
                                modName={modName}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Traits */}
                      {items.traits.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold mb-4">Traits</h4>
                          <div className="grid gap-4">
                            {items.traits.map((trait) => (
                              <TraitCard
                                key={trait.name}
                                trait={trait}
                                pkg={pkg.name}
                                modName={modName}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </LayoutWithSidebar>
  );
}

export default PackageView;
