import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React, { Fragment, useMemo } from "react";
import { findPackage, sortModuleItems, collectModuleItems, ModuleItems } from "@/lib/docs";
import TableOfContents from "@/components/table-of-contents";
import ItemSection from "@/components/item-section";
import LayoutWithSidebar from "@/components/layout-with-sidebar";

export default function PackagePage({ params }: { params: { pkg: string[] } }) {
  const Crumbs = useMemo(() => {
    const generateHref = (index: number) =>
      `/docs/packages/${params.pkg.slice(0, index + 1).join("/")}`;

    return (
      <Breadcrumb className="text-primary font-semibold p-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs/packages">Packages</BreadcrumbLink>
          </BreadcrumbItem>
          {params.pkg.map((pkg, index) => (
            <Fragment key={pkg}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={generateHref(index)}
                  className="capitalize"
                >
                  {pkg}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }, [params.pkg]);

  const pkg = findPackage(params.pkg);

  if (!pkg) return <div>Package not found</div>;

  if (pkg.name === "Default") {
    const moduleItems = new Map(
      pkg.modules?.map(module => [module.name, collectModuleItems(module)])
    );

    return (
      <LayoutWithSidebar pkg={pkg} crumbs={Crumbs}>
        <div className="space-y-12">
          {Array.from(moduleItems.entries())
            .sort(([, a], [, b]) => sortModuleItems(a, b))
            .map(([moduleName, items]) => (
              <section key={moduleName} className="border-t pt-6">
                <h2 className="text-2xl font-bold mb-6">
                  {moduleName}
                  <span className="text-sm text-muted-foreground ml-2">
                    ({Object.values(items).reduce((acc, curr) => acc + curr.length, 0)} items)
                  </span>
                </h2>
                {items && (
                  <>
                    <ItemSection title="Functions" items={items.functions} type="functions" />
                    <ItemSection title="Types" items={items.types} type="types" />
                    <ItemSection title="Variables" items={items.variables} type="variables" />
                    <ItemSection title="Constants" items={items.constants} type="constants" />
                  </>
                )}
              </section>
            ))}
        </div>
      </LayoutWithSidebar>
    );
  }

  const items = pkg.modules?.reduce((acc, module) => {
    const moduleItems = collectModuleItems(module);
    return {
      functions: [...acc.functions, ...moduleItems.functions],
      types: [...acc.types, ...moduleItems.types],
      constants: [...acc.constants, ...moduleItems.constants],
      variables: [...acc.variables, ...moduleItems.variables],
    };
  }, { functions: [], types: [], constants: [], variables: [] } as ModuleItems);

  return (
    <LayoutWithSidebar pkg={pkg} crumbs={Crumbs}>
      <h1 className="text-3xl font-bold mb-8">{pkg.name}</h1>
      {items && (
        <>
          <TableOfContents {...items} />
          <ItemSection title="Functions" items={items.functions} type="functions" />
          <ItemSection title="Types" items={items.types} type="types" />
          <ItemSection title="Variables" items={items.variables} type="variables" />
          <ItemSection title="Constants" items={items.constants} type="constants" />
        </>
      )}
    </LayoutWithSidebar>
  );
}
