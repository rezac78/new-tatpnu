import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ExamCreateView } from 'src/sections/exam/view';

// ----------------------------------------------------------------------

const metadata = { title: `ساخت آزمون | دسته بندی - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ExamCreateView />
    </>
  );
}
