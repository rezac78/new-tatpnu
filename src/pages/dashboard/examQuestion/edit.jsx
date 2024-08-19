import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useCallback } from 'react';

import { useParams } from 'src/routes/hooks';

import useIsMountedRef from 'src/hooks/useIsMountedRef';

import { AxiosComponent } from 'src/utils/AxiosComponent';

import fa from 'src/locales/fa';
import { CONFIG, BASE_LMS_API } from 'src/config-global';

import { toast } from 'src/components/snackbar';

import { ExamQuestionEditView } from 'src/sections/examQuestion/view';

// ----------------------------------------------------------------------

const metadata = { title: `ویرایش سوالات آزمون | داشبورد - ${CONFIG.site.name}` };

export default function Page() {
  const t = fa;
  const mounted = useIsMountedRef();
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id = '' } = useParams();
  const getQuestionOption = useCallback(async () => {
    await AxiosComponent({
      method: 'get',
      url: `${BASE_LMS_API}/exam-questions/${id}`,
      callback: (status, data) => {
        if (status) {
          setTableData(data.data);
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
      if (id) getQuestionOption();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ExamQuestionEditView Loading={isLoading} ExamQuestion={tableData} />
    </>
  );
}
