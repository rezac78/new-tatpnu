import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ProductSeasonsListView } from 'src/sections/productSeasons/view';

// ----------------------------------------------------------------------

const metadata = { title: `لیست فصل محصولات | داشبورد - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <ProductSeasonsListView />
    </>
  );
}
