import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UserProductsCreateView } from 'src/sections/userProducts/view';

// ----------------------------------------------------------------------

const metadata = { title: `ساخت محصولات کاربر | داشبورد - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserProductsCreateView />
    </>
  );
}
