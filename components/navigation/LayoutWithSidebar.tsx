import SidebarMenu from "@/components/navigation/Sidebar/SidebarMenu";
import Sidebar from "@/components/navigation/Sidebar/Sidebar";
import type { Package, Module } from "@/lib/docs";

type LayoutWithSidebarProps = {
  pkg: Package;
  module?: Module;
  crumbs: React.ReactNode;
  children: React.ReactNode;
};

export default function LayoutWithSidebar({
  pkg,
  module,
  crumbs,
  children,
}: LayoutWithSidebarProps) {
  return (
    <div className="min-h-screen relative">
      <SidebarMenu>
        <Sidebar pkg={pkg} activeModule={module} />
      </SidebarMenu>

      <div className="w-full lg:ml-[20%] lg:w-[80%]">
        <div className="p-4 lg:p-8">{children}</div>
      </div>

      <div className="fixed bottom-0 right-0">{crumbs}</div>
    </div>
  );
}
