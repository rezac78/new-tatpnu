import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { MenuListView } from 'src/sections/menu/view';

// ----------------------------------------------------------------------

const metadata = { title: `لیست منو | داشبورد - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <MenuListView />
    </>
  );
}
