import { paths } from 'src/routes/paths';

import fa from 'src/locales/fa';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductAttributeNewEditForm } from '../productAttribute-new-edit-form';

// ----------------------------------------------------------------------

export function ProductAttributeCreateView() {
  const t = fa;
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={`ساخت ${t.dashboard.pages.productAttribute}`}
        links={[
          { name: t.dashboard.title, href: paths.dashboard.root },
          { name: t.dashboard.pages.productAttribute, href: paths.dashboard.productAttribute.list },
          { name: t.dashboard.tableCommon.create },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProductAttributeNewEditForm />
    </DashboardContent>
  );
}
