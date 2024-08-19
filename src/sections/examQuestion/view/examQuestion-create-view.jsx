import { paths } from 'src/routes/paths';

import fa from 'src/locales/fa';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ExamQuestionNewEditForm } from '../examQuestion-new-edit-form';

// ----------------------------------------------------------------------

export function ExamQuestionCreateView() {
  const t = fa;
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={`ساخت ${t.dashboard.pages.questionOptions}`}
        links={[
          { name: t.dashboard.title, href: paths.dashboard.root },
          { name: t.dashboard.pages.exam, href: paths.dashboard.exam.list },
          { name: t.dashboard.pages.examQuestion, href: -1 },
          { name: t.dashboard.tableCommon.create },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ExamQuestionNewEditForm />
    </DashboardContent>
  );
}
