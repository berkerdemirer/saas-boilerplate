import { DashboardHeader } from '@/src/components/dashboard/header';
import { DashboardSidebar } from '@/src/components/dashboard/sidebar';
import { SidebarInset, SidebarProvider } from '@/src/components/ui/sidebar';
import { appConfig } from '@/src/utils/app-config';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <DashboardSidebar variant="inset" />
      <SidebarInset>
        <DashboardHeader
          items={[
            ...appConfig.dashboard.mainNavItems,
            ...appConfig.dashboard.secondaryNavItems,
          ]}
        />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
