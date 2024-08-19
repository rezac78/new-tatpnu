import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ExamListView } from 'src/sections/exam/view';

// ----------------------------------------------------------------------

const metadata = { title: `لیست آزمون | دسته بندی - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <ExamListView />
    </>
  );
}
