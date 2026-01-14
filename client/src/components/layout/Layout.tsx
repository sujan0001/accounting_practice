import { ReactNode } from 'react';
import TopNav from './TopNav';
import Sidebar from './Sidebar';
import ProjectNav from './ProjectNav';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <div className="flex">
        <Sidebar />
         <div className="flex-1 ml-64 mt-16">
          <ProjectNav />
          <main className="p-6 min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

