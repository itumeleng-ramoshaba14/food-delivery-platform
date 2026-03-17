'use client';

import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[256px] transition-all duration-200">
        <TopBar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
