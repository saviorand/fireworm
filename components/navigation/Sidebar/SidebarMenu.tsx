"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";

type ClientSidebarProps = {
  children: React.ReactNode;
  onItemClick?: () => void;
};

export default function SidebarMenu({
  children,
  onItemClick,
}: ClientSidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleClose = () => {
    setIsSidebarOpen(false);
    onItemClick?.();
  };

  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-3 right-4 z-50 p-1.5 bg-background border rounded-md"
      >
        {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      <aside
        className={`
        fixed top-0 left-0 h-full z-40 bg-background
        transform transition-transform duration-200 ease-in-out
        lg:transform-none lg:transition-none
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        w-[80%] sm:w-[60%] md:w-[40%] lg:w-[20%]
        border-r
      `}
      >
        <div className="w-full h-full" onClick={handleClose}>
          {children}
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
}
