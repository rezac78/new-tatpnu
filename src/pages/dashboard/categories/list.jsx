import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CategoriesListView } from 'src/sections/categories/view';

// ----------------------------------------------------------------------

const metadata = { title: `لیست زیر منو | دسته بندی - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <CategoriesListView />
    </>
  );
}
