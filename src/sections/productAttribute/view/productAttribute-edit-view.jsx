import { paths } from 'src/routes/paths';

import fa from 'src/locales/fa';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductAttributeNewEditForm } from '../productAttribute-new-edit-form';

// ----------------------------------------------------------------------

export function ProductAttributeEditView({ productAttribute: currentProductAttribute, Loading }) {
  const t = fa;
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t.dashboard.tableCommon.edit}
        links={[
          { name: t.dashboard.title, href: paths.dashboard.root },
          { name: t.dashboard.pages.productAttribute, href: paths.dashboard.productAttribute.list },
          { name: currentProductAttribute?.product_title },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProductAttributeNewEditForm Loading={Loading} currentProductAttribute={currentProductAttribute} />
    </DashboardContent>
  );
}
