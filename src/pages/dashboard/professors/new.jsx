import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ProfessorsCreateView } from 'src/sections/professors/view';

// ----------------------------------------------------------------------

const metadata = { title: `ساخت اساتید | داشبورد - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProfessorsCreateView />
    </>
  );
}
