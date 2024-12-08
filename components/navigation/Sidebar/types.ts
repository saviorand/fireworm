export type SidebarItem = {
  name: string;
  description?: string;
  module?: string;
  href: string;
};

export type SidebarItemTypeOnly = {
  name: string;
  module: string;
  type: string;
};
