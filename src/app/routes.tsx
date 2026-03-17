import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ChatPage } from '../domains/chat';
import { AdminPage } from '../domains/admin';

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
      {
        path: '/',
        element: <ChatPage />,
      },
      {
        path: '/admin',
        element: <AdminPage />,
      },
    ],
  },
]);
