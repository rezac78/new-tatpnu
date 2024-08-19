import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ProductAttributeListView } from 'src/sections/productAttribute/view';

// ----------------------------------------------------------------------

const metadata = { title: `لیست ویژگی محصولات | داشبورد - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <ProductAttributeListView />
    </>
  );
}
