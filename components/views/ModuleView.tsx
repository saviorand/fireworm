import React from "react";
import { Module, Package } from "@/lib/docs";
import LayoutWithSidebar from "@/components/navigation/LayoutWithSidebar";
import StructCard from "../cards/StructCard";
import AliasCard from "../cards/AliasCard";
import FunctionDoc from "../cards/FunctionCard";

function ModuleView(module: Module, pkg: Package, crumbs: React.ReactNode) {
  return (
    <LayoutWithSidebar pkg={pkg} crumbs={crumbs} module={module}>
      <div id="overview" className="space-y-12 scroll-mt-20">
        <section>
          <h1 className="text-3xl font-bold mb-8">{module.name}</h1>
          {module.description && (
            <p className="text-muted-foreground mb-8">{module.description}</p>
          )}
          {module.deprecated && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-8">
              <strong>Deprecated:</strong> {module.deprecated}
            </div>
          )}
        </section>

        <div className="space-y-16">
          <div className="border-l-2 pl-6">
            {/* Functions */}
            {module.functions && module.functions.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4">Functions</h4>
                <div className="grid grid-cols-1">
                  {module.functions.map((fn) => (
                    <FunctionDoc
                      key={fn.name}
                      func={fn}
                      pkg={pkg.name}
                      modName={module.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Structs/Types */}
            {module.structs && module.structs.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4">Types</h4>
                <div className="grid gap-4">
                  {module.structs.map((struct) => (
                    <StructCard
                      key={struct.name}
                      struct={struct}
                      pkg={pkg.name}
                      modName={module.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Traits */}
            {module.traits && module.traits.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4">Traits</h4>
                <div className="grid gap-4">
                  {module.traits.map((trait) => (
                    <div key={trait.name} className="p-4 bg-muted rounded-lg">
                      <div className="font-mono font-medium">{trait.name}</div>
                      {trait.description && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {trait.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Aliases */}
            {module.aliases && module.aliases.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4">Aliases</h4>
                <div className="grid gap-4">
                  {module.aliases.map((alias) => (
                    <AliasCard
                      key={alias.name}
                      alias={alias}
                      pkg={pkg.name}
                      modName={module.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </LayoutWithSidebar>
  );
}

export default ModuleView;
