import React from "react";
import { Package, collectModuleItems } from "@/lib/docs";
import LayoutWithSidebar from "@/components/navigation/LayoutWithSidebar";
import Link from "next/link";

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
                          <div className="grid grid-cols-1 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] gap-4">
                            {items.functions.map((fn) => (
                              <div
                                key={fn.name}
                                id={`${modName}-${fn.name}`}
                                className="p-4 bg-muted rounded-lg w-full scroll-mt-24"
                              >
                                <Link
                                  href={`/docs/packages/${pkg.name}/modules/${modName}#${fn.name}`}
                                  className="font-mono font-medium hover:text-primary break-words"
                                >
                                  {fn.name}
                                </Link>
                                {fn.overloads?.[0]?.signature && (
                                  <pre className="bg-background p-2 rounded mt-2 overflow-x-auto text-sm whitespace-pre-wrap">
                                    <code>{fn.overloads[0].signature}</code>
                                  </pre>
                                )}
                                {fn.overloads?.[0]?.description && (
                                  <p className="mt-2 text-sm text-muted-foreground">
                                    {fn.overloads[0].description}
                                  </p>
                                )}
                              </div>
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
                              <div
                                key={type.name}
                                id={`${modName}-${type.name}`}
                                className="scroll-mt-24"
                              >
                                <div className="p-6 bg-muted rounded-lg border border-muted-foreground/20">
                                  <div className="flex items-start justify-between gap-4 mb-4">
                                    <div>
                                      <Link
                                        href={`/docs/packages/${pkg.name}/modules/${modName}#${type.name}`}
                                        className="font-mono font-medium text-lg hover:text-primary flex items-center gap-2"
                                      >
                                        {type.name}
                                      </Link>
                                      {type.parentTraits &&
                                        type.parentTraits.length > 0 && (
                                          <div className="text-sm text-muted-foreground mt-1">
                                            implements{" "}
                                            {type.parentTraits.join(", ")}
                                          </div>
                                        )}
                                    </div>
                                  </div>

                                  {type.description && (
                                    <div className="mb-6 prose prose-sm max-w-none prose-neutral dark:prose-invert">
                                      <p>{type.description}</p>
                                    </div>
                                  )}

                                  {type.fields && type.fields.length > 0 && (
                                    <div>
                                      <div className="flex items-center justify-between mb-3">
                                        <h5 className="font-medium text-sm text-muted-foreground">
                                          Fields ({type.fields.length})
                                        </h5>
                                      </div>
                                      <div className="sm:w-fit bg-background rounded-md border border-muted-foreground/20">
                                        {type.fields.map((field) => (
                                          <div
                                            key={field.name}
                                            className="border-b last:border-b-0 border-muted-foreground/20 py-2 px-2"
                                          >
                                            <div className="flex flex-wrap sm:justify-between items-start gap-4">
                                              <div className="font-mono text-sm">
                                                <span className="text-muted-foreground">
                                                  {field.name}
                                                </span>
                                              </div>
                                              <div className="font-mono text-sm text-primary break-all">
                                                {field.type}
                                              </div>
                                            </div>
                                            {field.description && (
                                              <p className="text-sm text-muted-foreground mt-1 pl-4">
                                                {field.description}
                                              </p>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {type.parameters &&
                                    type.parameters.length > 0 && (
                                      <div className="mt-6">
                                        <h5 className="font-medium text-sm text-muted-foreground mb-3">
                                          Type Parameters
                                        </h5>
                                        <div className="bg-background rounded-md border border-muted-foreground/20">
                                          {type.parameters.map((param) => (
                                            <div
                                              key={param.name}
                                              className="border-b last:border-b-0 border-muted-foreground/20 p-2"
                                            >
                                              <div className="font-mono text-sm flex items-center gap-2">
                                                <span className="text-muted-foreground">
                                                  {param.name}
                                                </span>
                                                <span className="text-primary">
                                                  {param.type}
                                                </span>
                                              </div>
                                              {param.description && (
                                                <p className="text-sm text-muted-foreground mt-1 pl-4">
                                                  {param.description}
                                                </p>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                  {type.constraints && (
                                    <div className="mt-4 text-sm text-muted-foreground">
                                      <strong className="font-medium">
                                        Constraints:
                                      </strong>{" "}
                                      {type.constraints}
                                    </div>
                                  )}
                                </div>
                              </div>
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

                      {/* Variables */}
                      {items.variables.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold mb-4">
                            Variables
                          </h4>
                          <div className="grid gap-4">
                            {items.variables.map((variable) => (
                              <div
                                key={variable.name}
                                className="p-4 bg-muted rounded-lg"
                              >
                                <Link
                                  href={`/docs/packages/${pkg.name}/modules/${modName}#${variable.name}`}
                                  className="font-mono font-medium hover:text-primary"
                                >
                                  {variable.name}
                                </Link>
                                {variable.description && (
                                  <p className="mt-2 text-sm text-muted-foreground">
                                    {variable.description}
                                  </p>
                                )}
                              </div>
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
