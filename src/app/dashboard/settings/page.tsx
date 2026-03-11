import { getSiteSettings } from '@/lib/actions';
import SettingsClient from '@/components/dashboard/SettingsClient';

export default async function SettingsDashboardPage() {
  const settings = await getSiteSettings();
  return <SettingsClient settings={settings} />;
}
