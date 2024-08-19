import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ProductAttributeCreateView } from 'src/sections/productAttribute/view';

// ----------------------------------------------------------------------

const metadata = { title: `ساخت ویژگی محصولات | داشبورد - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductAttributeCreateView />
    </>
  );
}
