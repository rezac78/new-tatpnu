import { paths } from 'src/routes/paths';

import fa from 'src/locales/fa';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProfessorsNewEditForm } from '../professors-new-edit-form';

// ----------------------------------------------------------------------

export function ProfessorsEditView({ professors: currentProfessors, Loading }) {
  const t = fa;
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t.dashboard.tableCommon.edit}
        links={[
          { name: t.dashboard.title, href: paths.dashboard.root },
          { name: t.dashboard.pages.products, href: paths.dashboard.products.list },
          { name: t.dashboard.pages.professors, href: -1 },
          { name: currentProfessors?.fullname },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProfessorsNewEditForm Loading={Loading} currentProfessors={currentProfessors} />
    </DashboardContent>
  );
}
