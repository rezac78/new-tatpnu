import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { QuestionOptionCreateView } from 'src/sections/questionOption/view';

// ----------------------------------------------------------------------

const metadata = { title: `ساخت جواب سوالات | داشبورد - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <QuestionOptionCreateView />
    </>
  );
}
