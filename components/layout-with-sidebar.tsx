import React from 'react';
import Link from 'next/link';
import { collectModuleItems, Module, Package } from '@/lib/docs';
import Sidebar from './sidebar';

type SidebarItem = {
  name: string;
  description?: string;
  module?: string;
};

export const SidebarItemList = ({ 
  items, 
  href, 
  title 
}: { 
  items: SidebarItem[], 
  href: string, 
  title: string 
}) => (
  <div className="mb-6">
    <h3 className="font-semibold mb-3 text-muted-foreground">
      {title} ({items.length})
    </h3>
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={`${item.module || ''}-${item.name}`} className="flex w-fit">
          <Link
            href={`${href}#${item.name}`}
            className="text-sm hover:text-primary font-mono truncate inline-block relative z-10"
            title={item.description}
          >
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

function ModuleSidebar({ module }: { module: Module }) {
  const items = collectModuleItems(module);
  const baseHref = `/docs/modules/${module.name}`;

  return (
    <aside className="w-1/5 fixed top-16 left-0 bottom-0 overflow-y-auto border-r">
      <nav className="p-4 h-full relative">
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2">Index</h2>
          <div className="pl-4">
            <Link href="#overview" className="block py-1 hover:text-primary">
              Overview
            </Link>
            {items.functions.length > 0 && (
              <Link href="#functions" className="block py-1 hover:text-primary">
                Functions
              </Link>
            )}
            {items.types.length > 0 && (
              <Link href="#types" className="block py-1 hover:text-primary">
                Types
              </Link>
            )}
            {items.constants.length > 0 && (
              <Link href="#constants" className="block py-1 hover:text-primary">
                Constants
              </Link>
            )}
            {items.variables.length > 0 && (
              <Link href="#variables" className="block py-1 hover:text-primary">
                Variables
              </Link>
            )}
          </div>
        </div>
        {items.functions.length > 0 && (
          <SidebarItemList 
            title="Functions" 
            items={items.functions} 
            href={baseHref} 
          />
        )}
        {items.types.length > 0 && (
          <SidebarItemList 
            title="Types" 
            items={items.types} 
            href={baseHref} 
          />
        )}
        {items.constants.length > 0 && (
          <SidebarItemList 
            title="Constants" 
            items={items.constants} 
            href={baseHref} 
          />
        )}
        {items.variables.length > 0 && (
          <SidebarItemList 
            title="Variables" 
            items={items.variables} 
            href={baseHref} 
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </nav>
    </aside>
  );
}


type LayoutWithSidebarProps = {
  pkg: Package;
  module?: Module;
  crumbs: React.ReactNode;
  children: React.ReactNode;
};

function LayoutWithSidebar({ pkg, module, crumbs, children }: LayoutWithSidebarProps) {
  return (
    <div className="min-h-screen relative">
      {module ? <ModuleSidebar module={module} /> : <Sidebar pkg={pkg} />}
      <div className="ml-[20%] w-[80%]">
        <div className="p-8">
          {children}
        </div>
      </div>
      <div className="fixed bottom-0 right-0">{crumbs}</div>
    </div>
  );
}

export default LayoutWithSidebar;