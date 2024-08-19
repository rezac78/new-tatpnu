import { paths } from 'src/routes/paths';

import fa from 'src/locales/fa';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserCertificatesNewEditFormExcel } from '../userCertificates-new-edit-form-Excel';

// ----------------------------------------------------------------------

export function UserCertificatesCreateViewExcel() {
  const t = fa;
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={`ساخت ${t.dashboard.pages.userCertificates}`}
        links={[
          { name: t.dashboard.title, href: paths.dashboard.root },
          { name: t.dashboard.pages.userCertificates, href: paths.dashboard.userCertificates.list },
          { name: t.dashboard.tableCommon.create },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserCertificatesNewEditFormExcel />
    </DashboardContent>
  );
}
