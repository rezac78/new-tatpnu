import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/dashboard/index'));
// menu
const MenuListPage = lazy(() => import('src/pages/dashboard/menu/list'));
const MenuCreatePage = lazy(() => import('src/pages/dashboard/menu/new'));
const MenuEditPage = lazy(() => import('src/pages/dashboard/menu/edit'));
// submenu
const SubMenuListPage = lazy(() => import('src/pages/dashboard/submenu/list'));
const SubMenuCreatePage = lazy(() => import('src/pages/dashboard/submenu/new'));
const SubMenuEditPage = lazy(() => import('src/pages/dashboard/submenu/edit'));

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <IndexPage />, index: true },
      {
        path: 'menu',
        children: [
          { path: 'list', element: <MenuListPage /> },
          { path: 'new', element: <MenuCreatePage /> },
          { path: ':id/edit', element: <MenuEditPage /> },
        ],
      },
      {
        path: 'submenu',
        children: [
          { path: 'list', element: <SubMenuListPage /> },
          { path: 'new', element: <SubMenuCreatePage /> },
          { path: ':id/edit', element: <SubMenuEditPage /> },
        ],
      }
    ],
  },
];
