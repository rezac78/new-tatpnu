import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UserCertificatesListView } from 'src/sections/userCertificates/view';

// ----------------------------------------------------------------------

const metadata = { title: `لیست محصولات گواهی کاربر | داشبورد - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <UserCertificatesListView />
    </>
  );
}
