import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UserProductsListView } from 'src/sections/userProducts/view';

// ----------------------------------------------------------------------

const metadata = { title: `لیست محصولات کاربر | داشبورد - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <UserProductsListView />
    </>
  );
}
