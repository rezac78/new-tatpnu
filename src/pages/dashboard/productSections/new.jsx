import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ProductSectionsCreateView } from 'src/sections/productSections/view';

// ----------------------------------------------------------------------

const metadata = { title: `ساخت محصولات | داشبورد - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductSectionsCreateView />
    </>
  );
}
