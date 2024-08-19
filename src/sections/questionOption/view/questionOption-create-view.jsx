import { paths } from 'src/routes/paths';

import fa from 'src/locales/fa';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { QuestionOptionNewEditForm } from '../questionOption-new-edit-form';

// ----------------------------------------------------------------------

export function QuestionOptionCreateView() {
  const t = fa;
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={`ساخت ${t.dashboard.pages.questionOptions}`}
        links={[
          { name: t.dashboard.title, href: paths.dashboard.root },
          { name: t.dashboard.pages.exam, href: paths.dashboard.exam.list },
          { name: t.dashboard.pages.examQuestion, href: paths.dashboard.examQuestion.list },
          { name: t.dashboard.pages.questionOptions, href: -1 },
          { name: t.dashboard.tableCommon.create },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <QuestionOptionNewEditForm />
    </DashboardContent>
  );
}
