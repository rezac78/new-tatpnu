import { z as zod } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { Switch, CircularProgress, FormControlLabel } from '@mui/material';

import { useParams, useRouter } from 'src/routes/hooks';

import { AxiosComponent } from 'src/utils/AxiosComponent';

import fa from 'src/locales/fa';
import { BASE_LMS_API } from 'src/config-global';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

export const NewUserSchema = zod.object({
  option: zod.string().min(1, { message: 'عنوان نباید خالی باشد' }),
  is_correct: zod.union([zod.boolean(), zod.number()]),
});

export function QuestionOptionNewEditForm({ currentExamOption, Loading }) {
  const router = useRouter();
  const t = fa;
  const Ids = useParams();
  const defaultValues = useMemo(
    () => ({
      option: currentExamOption?.option || '',
      is_correct: currentExamOption?.is_correct ?? false,
    }),
    [currentExamOption]
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    control,
    formState: { isSubmitting },
  } = methods;
  useEffect(() => {
    reset(defaultValues);
  }, [currentExamOption, reset, defaultValues]);

  const submitHandler = useCallback(
    async (data, shouldRedirect = false) => {
      try {
        const url = !currentExamOption
          ? `question-options/store`
          : `question-options/${currentExamOption.id}?_method=PUT`;
        const formData = new FormData();
        if (!currentExamOption) {
          formData.append('exam_question_id', Ids.id);
        } else {
          formData.append('exam_question_id', Ids.editId);
        }
        formData.append('option', data.option);
        formData.append('is_correct', data.is_correct ? '1' : '0');
        await AxiosComponent({
          method: 'post',
          url: `${BASE_LMS_API}/${url}`,
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
          callback: (status) => {
            if (status) {
              reset();
              toast.success(
                currentExamOption
                  ? t.dashboard.tableCommon.mesUpdate
                  : t.dashboard.tableCommon.mesCreate
              );
              reset();
              if (shouldRedirect) {
                router.back();
              }
            } else {
              toast.error(t.dashboard.tableCommon.mesError);
            }
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
    [currentExamOption, router, reset, t, Ids]
  );
  const isCorrect = Boolean(watch('is_correct'));

  return (
    <Form methods={methods} onSubmit={handleSubmit((data) => submitHandler(data))}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          {currentExamOption && Loading ? (
            <div className="flex items-center justify-center">
              <CircularProgress />
            </div>
          ) : (
            <Card sx={{ p: 3 }}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <Field.Text name="option" label="جواب" />
                <FormControlLabel
                  control={
                    <Controller
                      name="is_correct"
                      control={control}
                      render={({ field }) => <Switch {...field} checked={Boolean(field.value)} />}
                    />
                  }
                  label={isCorrect ? 'جواب درست' : 'جواب غلط'}
                  sx={{ pl: 3, flexGrow: 1 }}
                />
              </Box>
              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  type="button"
                  variant="contained"
                  loading={isSubmitting}
                  onClick={handleSubmit((data) => submitHandler(data, false))}
                >
                  {!currentExamOption
                    ? t.dashboard.tableCommon.create
                    : t.dashboard.tableCommon.edit}
                </LoadingButton>
                <LoadingButton
                  type="button"
                  variant="contained"
                  loading={isSubmitting}
                  onClick={handleSubmit((data) => submitHandler(data, true))}
                >
                  {!currentExamOption
                    ? t.dashboard.tableCommon.createAndExist
                    : t.dashboard.tableCommon.editAndExist}
                </LoadingButton>
              </Stack>
            </Card>
          )}
        </Grid>
      </Grid>
    </Form>
  );
}
