import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useCallback } from 'react';

import { useParams } from 'src/routes/hooks';

import useIsMountedRef from 'src/hooks/useIsMountedRef';

import { AxiosComponent } from 'src/utils/AxiosComponent';

import fa from 'src/locales/fa';
import { CONFIG, BASE_LMS_API } from 'src/config-global';

import { toast } from 'src/components/snackbar';

import { ProductSeasonsEditView } from 'src/sections/productSeasons/view';

// ----------------------------------------------------------------------

const metadata = { title: `ویرایش فصل | داشبورد - ${CONFIG.site.name}` };

export default function Page() {
  const t = fa;
  const mounted = useIsMountedRef();
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { id = '' } = useParams();
  const getMedias = useCallback(async () => {
    await AxiosComponent({
      method: 'get',
      url: `${BASE_LMS_API}/product-seasons/${id}`,
      // data.data
      callback: (status, data) => {
        if (status) {
          setTableData({
            id: data.data.id,
            product_id: data.data.product_id,
            sort_item: data.data.sort,
            title: data.data.title,
          });
        } else {
          toast.error(t.dashboard.tableCommon.mesError);
        }
      },
    });
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (mounted) {
      if (id) getMedias();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductSeasonsEditView Loading={isLoading} ProductSeasons={tableData} />
    </>
  );
}
