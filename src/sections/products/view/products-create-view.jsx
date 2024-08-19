import { paths } from 'src/routes/paths';

import fa from 'src/locales/fa';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductsNewEditForm } from '../products-new-edit-form';

// ----------------------------------------------------------------------

export function ProductsCreateView() {
  const t = fa;
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={`ساخت ${t.dashboard.pages.products}`}
        links={[
          { name: t.dashboard.title, href: paths.dashboard.root },
          { name: t.dashboard.pages.products, href: paths.dashboard.products.list },
          { name: t.dashboard.tableCommon.create },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <ProductsNewEditForm />
    </DashboardContent>
  );
}
