import { paths } from 'src/routes/paths';

import fa from 'src/locales/fa';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { SubMenuNewEditForm } from '../submenu-new-edit-form';

// ----------------------------------------------------------------------

export function SubMenuEditView({ submenu: currentSubMenu, Loading }) {
  const t = fa;
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t.dashboard.tableCommon.edit}
        links={[
          { name: t.dashboard.title, href: paths.dashboard.root },
          { name: t.dashboard.pages.submenu, href: paths.dashboard.submenu.list },
          { name: currentSubMenu?.title },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <SubMenuNewEditForm Loading={Loading} currentSubMenu={currentSubMenu} />
    </DashboardContent>
  );
}
