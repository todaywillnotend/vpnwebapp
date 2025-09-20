import React from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="inset-0 bg-black/80 z-[1000] flex sm:justify-center sm:items-center sm:p-5 min-h-screen">
      <main className="bg-black rounded-none w-full max-w-[667px] text-white pt-[48px] px-[12px] pb-[24px] sm:rounded-[20px] sm:max-w-[375px] min-h-screen sm:min-h-[765px] sm:h-[765px] sm:border-4 border-gray-600 flex flex-col overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
