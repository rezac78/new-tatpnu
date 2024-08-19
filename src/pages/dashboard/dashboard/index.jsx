import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UserListView } from 'src/sections/blank/view';

// ----------------------------------------------------------------------

const metadata = { title: `تست table | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserListView title="داشبورد" />
    </>
  );
}
