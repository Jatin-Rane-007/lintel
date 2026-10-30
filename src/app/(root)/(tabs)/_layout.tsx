import AppTabs from '@/components/app-tabs';

/**
 * The five destinations render through our own tab bar (`app-tabs.tsx`)
 * rather than the platform one, so the bar can carry the paper ground, the
 * hairline edge and the ember selection marker.
 */
export default function TabsLayout() {
  return <AppTabs />;
}
