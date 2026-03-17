import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ChatPage } from '../domains/chat';
import { AdminPage } from '../domains/admin';
import { NotionSyncPage } from '../domains/admin/components/NotionSyncPage';
import { DocumentsPage } from '../domains/admin/components/DocumentsPage';
import { SettingsPage } from '../domains/admin/components/SettingsPage';
import { GuidePage } from '../domains/admin/components/GuidePage';

function RootLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <ChatPage /> },
      { path: '/admin', element: <AdminPage /> },
      { path: '/admin/notion', element: <NotionSyncPage /> },
      { path: '/admin/documents', element: <DocumentsPage /> },
      { path: '/admin/settings', element: <SettingsPage /> },
      { path: '/admin/guide', element: <GuidePage /> },
    ],
  },
]);
