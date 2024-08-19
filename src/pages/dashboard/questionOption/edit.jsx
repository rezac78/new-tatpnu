import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useCallback } from 'react';

import { useParams } from 'src/routes/hooks';

import useIsMountedRef from 'src/hooks/useIsMountedRef';

import { AxiosComponent } from 'src/utils/AxiosComponent';

import fa from 'src/locales/fa';
import { CONFIG, BASE_LMS_API } from 'src/config-global';

import { QuestionOptionEditView } from 'src/sections/questionOption/view';

// ----------------------------------------------------------------------

const metadata = { title: `ویرایش جواب آزمون | داشبورد - ${CONFIG.site.name}` };

export default function Page() {
  const t = fa;
  const mounted = useIsMountedRef();
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id = '' } = useParams();

  const getQuestionOption = useCallback(async () => {
    await AxiosComponent({
      method: 'get',
      url: `${BASE_LMS_API}/question-options/${id}`,
      callback: (status, data) => {
        if (status) {
          setTableData(data.data);
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

      <QuestionOptionEditView Loading={isLoading} ExamOption={tableData} />
    </>
  );
}
