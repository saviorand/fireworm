import { useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";
import LayoutWithSidebar from "@/components/navigation/LayoutWithSidebar";
import { collectModuleItems, getAllPackages } from "@/lib/docs";
import TableOfContents from "@/components/TableOfContents";
import ItemSection from "@/components/ItemSection";
import Link from "next/link";

export default function ModulePage({ params }: { params: { mod: string[] } }) {
  const moduleName = params.mod[params.mod.length - 1];

  const { pkg, module } = useMemo(() => {
    const packages = getAllPackages();
    for (const { package: pkg } of packages) {
      const module = pkg.modules?.find((m) => m.name === moduleName);
      if (module) {
        return { pkg, module };
      }
    }
    return { pkg: null, module: null };
  }, [moduleName]);

  const Crumbs = useMemo(() => {
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
          {pkg && pkg.name !== "Default" && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/docs/packages/${pkg.name}`}>
                  {pkg.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/docs/modules/${moduleName}`}>
              {moduleName}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }, [moduleName, pkg]);

  if (!pkg || !module) return <div>Module not found</div>;

  const items = collectModuleItems(module);

  return (
    <LayoutWithSidebar pkg={pkg} module={module} crumbs={Crumbs}>
      <section id="overview" className="mb-12">
        <div className="flex items-baseline gap-4 mb-4">
          <h1 className="text-3xl font-bold">{module.name}</h1>
          {pkg.name !== "Default" && (
            <Link
              href={`/docs/packages/${pkg.name}`}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {pkg.name} package
            </Link>
          )}
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

export async function generateStaticParams() {
  const packages = getAllPackages();
  const paths: { mod: string[] }[] = [];

  packages.forEach(({ package: pkg }) => {
    pkg.modules?.forEach((module) => {
      paths.push({ mod: [module.name] });
    });
  });

  return paths;
}
