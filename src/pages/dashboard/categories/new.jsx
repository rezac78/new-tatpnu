import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CategoriesCreateView } from 'src/sections/categories/view';

// ----------------------------------------------------------------------

const metadata = { title: `ساخت زیر منو | دسته بندی - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CategoriesCreateView />
    </>
  );
}
