import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ExamQuestionCreateView } from 'src/sections/examQuestion/view';

// ----------------------------------------------------------------------

const metadata = { title: `ساخت سوالات آزمون | داشبورد - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ExamQuestionCreateView />
    </>
  );
}
