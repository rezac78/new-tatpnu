import { paths } from 'src/routes/paths';

import fa from 'src/locales/fa';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductsNewEditForm } from '../products-new-edit-form';

// ----------------------------------------------------------------------

export function ProductsEditView({ products: currentProducts, Loading }) {
  const t = fa;
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t.dashboard.tableCommon.edit}
        links={[
          { name: t.dashboard.title, href: paths.dashboard.root },
          { name: t.dashboard.pages.products, href: paths.dashboard.products.list },
          { name: currentProducts?.title },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProductsNewEditForm Loading={Loading} currentProducts={currentProducts} />
    </DashboardContent>
  );
}
