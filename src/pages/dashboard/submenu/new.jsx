import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { SubMenuCreateView } from 'src/sections/submenu/view';

// ----------------------------------------------------------------------

const metadata = { title: `ساخت زیر منو | داشبورد - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SubMenuCreateView />
    </>
  );
}
