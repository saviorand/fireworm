import React from "react";
import { Package, Module, collectModuleItems } from "@/lib/docs";
import LayoutWithSidebar from "@/components/navigation/LayoutWithSidebar";
import Link from "next/link";
import TableOfContents from "@/components/TableOfContents";
import ItemSection from "@/components/ItemSection";

function ModuleView(module: Module, pkg: Package, crumbs: React.ReactNode) {
  const items = collectModuleItems(module);

  return (
    <LayoutWithSidebar pkg={pkg} module={module} crumbs={crumbs}>
      <section id="overview" className="mb-12">
        <div className="flex items-baseline gap-4 mb-4">
          <h1 className="text-3xl font-bold">{module.name}</h1>
          <Link
            href={`/docs/packages/${pkg.name}`}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            {pkg.name} package
          </Link>
        </div>
        {module.description && (
          <p className="text-lg mb-8">{module.description}</p>
        )}
        <TableOfContents {...items} />
      </section>
      <ItemSection title="Functions" items={items.functions} type="functions" />
      <ItemSection title="Types" items={items.types} type="types" />
      <ItemSection title="Variables" items={items.variables} type="variables" />
      <ItemSection title="Constants" items={items.constants} type="constants" />
    </LayoutWithSidebar>
  );
}

export default ModuleView;
