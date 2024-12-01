import { useMemo } from "react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import LayoutWithSidebar from "@/components/layout-with-sidebar";
import { findPackage, collectModuleItems, getAllPackages } from "@/lib/docs";
import TableOfContents from "@/components/table-of-contents";
import ItemSection from "@/components/item-section";

export default function ModulePage({ params }: { params: { mod: string[] } }) {
  const moduleName = params.mod[params.mod.length - 1];
  const packageName = params.mod[0];
  
  const Crumbs = useMemo(() => {
    const generateHref = (index: number) =>
      `/docs/${params.mod.slice(0, index + 1).join("/")}`;

    return (
      <Breadcrumb className="text-primary font-semibold p-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs/packages">Modules</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/docs/modules/${moduleName}`}>
              {packageName}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }, [params.mod, packageName, moduleName]);

  const pkg = findPackage([packageName]);
  if (!pkg) return <div>Package not found</div>;

  const module = pkg.modules?.find(m => m.name === moduleName);
  if (!module) return <div>Module not found</div>;

  const items = collectModuleItems(module);

  return (
    <LayoutWithSidebar pkg={pkg} module={module} crumbs={Crumbs}>
      <section id="overview" className="mb-12">
        <h1 className="text-3xl font-bold mb-4">{module.name}</h1>
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
    pkg.modules?.forEach(module => {
      paths.push({ mod: [pkg.name, module.name] });
    });
  });

  return paths;
}
