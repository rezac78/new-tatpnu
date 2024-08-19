import { paths } from 'src/routes/paths';

import fa from 'src/locales/fa';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductSeasonsNewEditForm } from '../productSeasons-new-edit-form';

// ----------------------------------------------------------------------

export function ProductSeasonsEditView({ ProductSeasons: currentProductSeasons, Loading }) {
  const t = fa;
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t.dashboard.tableCommon.edit}
        links={[
          { name: t.dashboard.title, href: paths.dashboard.root },
          { name: t.dashboard.pages.products, href: paths.dashboard.products.list },
          { name: t.dashboard.pages.userProducts },
          { name: currentProductSeasons?.title },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProductSeasonsNewEditForm Loading={Loading} currentProductSeasons={currentProductSeasons} />
    </DashboardContent>
  );
}
