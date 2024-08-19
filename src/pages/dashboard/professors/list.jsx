import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ProfessorsListView } from 'src/sections/professors/view';

// ----------------------------------------------------------------------

const metadata = { title: `لیست اساتید | داشبورد - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <ProfessorsListView/>
    </>
  );
}
