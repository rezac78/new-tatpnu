import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { SubMenuListView } from 'src/sections/submenu/view';

// ----------------------------------------------------------------------

const metadata = { title: `لیست زیر منو | داشبورد - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <SubMenuListView />
    </>
  );
}
