"use client";

import { Heart, Home, Compass } from "lucide-react";

type NavbarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const tabs = [
    { name: "Home", icon: Home },
    { name: "Discover", icon: Compass },
    { name: "Matches", icon: Heart },
  ];

  return (
    <header className="sticky top-0 z-50 border-b-2 border-black bg-white">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:px-5 sm:py-4">
        <div className="flex shrink-0 items-center gap-1 text-3xl font-black tracking-tight sm:text-4xl">
            coy
            <span className="mt-4.5 inline-block h-2 w-2 rounded-full bg-[#ff3480] sm:h-3 sm:w-3"></span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {tabs.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => setActiveTab(name)}
              className={`flex items-center gap-2 rounded-full border-2 border-black px-3 py-2 text-sm font-bold transition-all sm:px-4 ${
                activeTab === name
                  ? "bg-[#ff3480] text-white shadow-[3px_3px_0px_#000]"
                  : "bg-white hover:bg-[#ffe2ee]"
              }`}
            >
              <Icon size={17} />
              <span className="hidden sm:inline">{name}</span>
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}