import { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { findPackage, getAllPackages } from "@/lib/docs";
import ModuleView from "@/components/views/ModuleView";
import PackageView from "@/components/views/PackageView";

type PageParams = {
  params: {
    pkg: string[];
  };
};

export default function PackagePage({ params }: PageParams) {
  const pkgParams = params.pkg ?? [];
  const isModuleView = pkgParams.length === 3 && pkgParams[1] === "modules";
  const packageName = pkgParams[0];
  const moduleName = isModuleView ? pkgParams[2] : undefined;

  const pkg = findPackage([packageName]);
  if (!pkg) return <div>Package not found</div>;

  const module = isModuleView
    ? pkg.modules?.find((m) => m.name === moduleName)
    : undefined;

  if (isModuleView && !module) return <div>Module not found</div>;

  const Crumbs = (
    <Breadcrumb className="text-primary font-semibold p-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs/packages">Packages</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={`/docs/packages/${pkg.name}`}>
            {pkg.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
        {isModuleView && module && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/docs/packages/${pkg.name}/modules/${module.name}`}
              >
                {module.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );

  if (isModuleView && module) {
    return ModuleView(module, pkg, Crumbs);
  }

  return PackageView(pkg, Crumbs);
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const pkgParams = params.pkg ?? [];
  const isModuleView = pkgParams.length === 3 && pkgParams[1] === "modules";
  const packageName = pkgParams[0];
  const moduleName = isModuleView ? pkgParams[2] : undefined;

  const pkg = findPackage([packageName]);
  if (!pkg) return { title: "Package Not Found" };

  if (isModuleView) {
    const module = pkg.modules?.find((m) => m.name === moduleName);
    if (!module) return { title: "Module Not Found" };

    return {
      title: `${module.name} - ${pkg.name}`,
      description: module.description,
    };
  }

  return {
    title: pkg.name,
    description: pkg.description,
  };
}

export async function generateStaticParams() {
  const packages = getAllPackages();
  const paths: { pkg: string[] }[] = [];

  packages.forEach(({ package: pkg }) => {
    paths.push({ pkg: [pkg.name] });

    pkg.modules?.forEach((module) => {
      paths.push({
        pkg: [pkg.name, "modules", module.name],
      });
    });
  });

  return paths;
}
