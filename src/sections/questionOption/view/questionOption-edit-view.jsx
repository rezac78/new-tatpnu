import { paths } from 'src/routes/paths';

import fa from 'src/locales/fa';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { QuestionOptionNewEditForm } from '../questionOption-new-edit-form';

// ----------------------------------------------------------------------

export function QuestionOptionEditView({ ExamOption: currentExamOption, Loading }) {
  const t = fa;
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t.dashboard.tableCommon.edit}
        links={[
          { name: t.dashboard.title, href: paths.dashboard.root },
          { name: t.dashboard.pages.exam, href: paths.dashboard.exam.list },
          { name: t.dashboard.pages.examQuestion, href: -1 },
          { name: currentExamOption?.option },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <QuestionOptionNewEditForm Loading={Loading} currentExamOption={currentExamOption} />
    </DashboardContent>
  );
}
