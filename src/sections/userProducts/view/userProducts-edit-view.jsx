import { paths } from 'src/routes/paths';

import fa from 'src/locales/fa';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserProductsNewEditForm } from '../userProducts-new-edit-form';

// ----------------------------------------------------------------------

export function UserProductsEditView({ UserProducts: currentUserProducts, Loading }) {
  const t = fa;
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t.dashboard.tableCommon.edit}
        links={[
          { name: t.dashboard.title, href: paths.dashboard.root },
          { name: t.dashboard.pages.userProducts, href: paths.dashboard.userProducts.list },
          { name: currentUserProducts?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserProductsNewEditForm Loading={Loading} currentUserProducts={currentUserProducts} />
    </DashboardContent>
  );
}
