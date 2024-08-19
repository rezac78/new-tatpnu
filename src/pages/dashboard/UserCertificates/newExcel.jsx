import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UserCertificatesCreateViewExcel } from 'src/sections/userCertificates/view';

// ----------------------------------------------------------------------

const metadata = { title: `ساخت گواهینامه کاربر  | داشبورد - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserCertificatesCreateViewExcel />
    </>
  );
}
