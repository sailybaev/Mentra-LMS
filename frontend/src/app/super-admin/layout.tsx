import { SuperAdminSidebar } from '@/components/layout/SuperAdminSidebar'

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <SuperAdminSidebar />
      <main className="flex-1 overflow-y-auto bg-white px-8 py-6">
        {children}
      </main>
    </div>
  )
}
