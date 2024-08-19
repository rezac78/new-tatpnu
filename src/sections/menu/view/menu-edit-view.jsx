import { paths } from 'src/routes/paths';

import fa from 'src/locales/fa';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { MenuNewEditForm } from '../menu-new-edit-form';

// ----------------------------------------------------------------------

export function MenuEditView({ menu: currentMenu, Loading }) {
  const t = fa;
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t.dashboard.tableCommon.edit}
        links={[
          { name: t.dashboard.title, href: paths.dashboard.root },
          { name: t.dashboard.pages.menu, href: paths.dashboard.menu.list },
          { name: currentMenu?.title },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <MenuNewEditForm Loading={Loading} currentMenu={currentMenu} />
    </DashboardContent>
  );
}
