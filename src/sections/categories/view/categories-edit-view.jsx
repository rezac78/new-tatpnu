import { paths } from 'src/routes/paths';

import fa from 'src/locales/fa';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CategoriesNewEditForm } from '../categories-new-edit-form';

// ----------------------------------------------------------------------

export function CategoriesEditView({ categories: currentCategories, Loading }) {
  const t = fa;
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t.dashboard.tableCommon.edit}
        links={[
          { name: t.dashboard.title, href: paths.dashboard.root },
          { name: t.dashboard.pages.categories, href: paths.dashboard.categories.list },
          { name: currentCategories?.title },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CategoriesNewEditForm Loading={Loading} currentCategories={currentCategories} />
    </DashboardContent>
  );
}
