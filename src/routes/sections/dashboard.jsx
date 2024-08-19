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
// categories
const CategoriesListPage = lazy(() => import('src/pages/dashboard/categories/list'));
const CategoriesCreatePage = lazy(() => import('src/pages/dashboard/categories/new'));
const CategoriesEditPage = lazy(() => import('src/pages/dashboard/categories/edit'));
// products
const ProductsListPage = lazy(() => import('src/pages/dashboard/products/list'));
const ProductsCreatePage = lazy(() => import('src/pages/dashboard/products/new'));
const ProductsEditPage = lazy(() => import('src/pages/dashboard/products/edit'));
// userProducts
const UserProductsListPage = lazy(() => import('src/pages/dashboard/userProducts/list'));
const UserProductsCreatePage = lazy(() => import('src/pages/dashboard/userProducts/new'));
const UserProductsEditPage = lazy(() => import('src/pages/dashboard/userProducts/edit'));
// ProductAttribute
const ProductAttributeListPage = lazy(() => import('src/pages/dashboard/productAttribute/list'));
const ProductAttributeCreatePage = lazy(() => import('src/pages/dashboard/productAttribute/new'));
const ProductAttributeEditPage = lazy(() => import('src/pages/dashboard/productAttribute/edit'));
// UserCertificates
const UserCertificatesListPage = lazy(() => import('src/pages/dashboard/UserCertificates/list'));
const UserCertificatesCreatePage = lazy(() => import('src/pages/dashboard/UserCertificates/new'));
const UserCertificatesCreateExcelPage = lazy(
  () => import('src/pages/dashboard/UserCertificates/newExcel')
);
const UserCertificatesEditPage = lazy(() => import('src/pages/dashboard/UserCertificates/edit'));
// Professors
const ProfessorsListPage = lazy(() => import('src/pages/dashboard/professors/list'));
const ProfessorsCreatePage = lazy(() => import('src/pages/dashboard/professors/new'));
const ProfessorsEditPage = lazy(() => import('src/pages/dashboard/professors/edit'));
// exam
const ExamListPage = lazy(() => import('src/pages/dashboard/exam/list'));
const ExamCreatePage = lazy(() => import('src/pages/dashboard/exam/new'));
const ExamEditPage = lazy(() => import('src/pages/dashboard/exam/edit'));
// examQuestion
const ExamQuestionListPage = lazy(() => import('src/pages/dashboard/examQuestion/list'));
const ExamQuestionCreatePage = lazy(() => import('src/pages/dashboard/examQuestion/new'));
const ExamQuestionEditPage = lazy(() => import('src/pages/dashboard/examQuestion/edit'));
// questionOption
const QuestionOptionsListPage = lazy(() => import('src/pages/dashboard/questionOption/list'));
const QuestionOptionsCreatePage = lazy(() => import('src/pages/dashboard/questionOption/new'));
const QuestionOptionsEditPage = lazy(() => import('src/pages/dashboard/questionOption/edit'));
// productSections
const ProductSectionsListPage = lazy(() => import('src/pages/dashboard/productSections/list'));
const ProductSectionsCreatePage = lazy(() => import('src/pages/dashboard/productSections/new'));
const ProductSectionsEditPage = lazy(() => import('src/pages/dashboard/productSections/edit'));
// productSeasons
const ProductSeasonsListPage = lazy(() => import('src/pages/dashboard/productSeasons/list'));
const ProductSeasonsCreatePage = lazy(() => import('src/pages/dashboard/productSeasons/new'));
const ProductSeasonsEditPage = lazy(() => import('src/pages/dashboard/productSeasons/edit'));
// ----------------------------------------------------------------------

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
      },
      {
        path: 'categories',
        children: [
          { path: 'list', element: <CategoriesListPage /> },
          { path: 'new', element: <CategoriesCreatePage /> },
          { path: ':id/edit', element: <CategoriesEditPage /> },
        ],
      },
      {
        path: 'products',
        children: [
          { path: 'list', element: <ProductsListPage /> },
          { path: 'new', element: <ProductsCreatePage /> },
          { path: ':id/edit', element: <ProductsEditPage /> },
        ],
      },
      {
        path: 'user-products',
        children: [
          { path: 'list', element: <UserProductsListPage /> },
          { path: 'new', element: <UserProductsCreatePage /> },
          { path: ':id/edit', element: <UserProductsEditPage /> },
        ],
      },
      {
        path: 'product-attribute',
        children: [
          { path: 'list', element: <ProductAttributeListPage /> },
          { path: 'new/:id', element: <ProductAttributeCreatePage /> },
          { path: ':id/edit', element: <ProductAttributeEditPage /> },
        ],
      },
      {
        path: 'user-certificates',
        children: [
          { path: 'list', element: <UserCertificatesListPage /> },
          { path: 'new', element: <UserCertificatesCreatePage /> },
          { path: 'new/Excel', element: <UserCertificatesCreateExcelPage /> },
          { path: ':id/edit', element: <UserCertificatesEditPage /> },
        ],
      },
      {
        path: 'professors',
        children: [
          { path: 'list/:id', element: <ProfessorsListPage /> },
          { path: 'new/:id', element: <ProfessorsCreatePage /> },
          { path: ':id/edit', element: <ProfessorsEditPage /> },
        ],
      },
      {
        path: 'exam',
        children: [
          { path: 'list', element: <ExamListPage /> },
          { path: 'new', element: <ExamCreatePage /> },
          { path: ':id/edit', element: <ExamEditPage /> },
        ],
      },
      {
        path: 'exam-questions',
        children: [
          { path: 'list/:id', element: <ExamQuestionListPage /> },
          { path: 'new/:id', element: <ExamQuestionCreatePage /> },
          { path: ':id/edit', element: <ExamQuestionEditPage /> },
        ],
      },
      {
        path: 'question-options',
        children: [
          { path: 'list/:id', element: <QuestionOptionsListPage /> },
          { path: 'new/:id', element: <QuestionOptionsCreatePage /> },
          { path: ':id/:editId/edit', element: <QuestionOptionsEditPage /> },
        ],
      },
      {
        path: 'product-seasons',
        children: [
          { path: 'list', element: <ProductSeasonsListPage /> },
          { path: 'new', element: <ProductSeasonsCreatePage /> },
          { path: ':id/edit', element: <ProductSeasonsEditPage /> },
        ],
      },
      {
        path: 'product-sections',
        children: [
          { path: 'list/:session_id/:product_id', element: <ProductSectionsListPage /> },
          { path: 'new/:session_id/:product_id', element: <ProductSectionsCreatePage /> },
          { path: ':id/:product_id/edit', element: <ProductSectionsEditPage /> },
        ],
      },
      // {
      //   path: 'group',
      //   children: [
      //     { element: <PageFour />, index: true },
      //     { path: 'five', element: <PageFive /> },
      //     { path: 'six', element: <PageSix /> },
      //   ],
      // },
    ],
  },
];
