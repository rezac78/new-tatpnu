import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Typography, CircularProgress } from '@mui/material';

import { AxiosComponent } from 'src/utils/AxiosComponent';

import fa from 'src/locales/fa';
import { BASE_LMS_API } from 'src/config-global';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
// ----------------------------------------------------------------------
export const NewUserSchema = zod.object({
  file: schemaHelper.file({ message: { required_error: 'نباید خالی باشد' } }),
});
// ----------------------------------------------------------------------

export function UserCertificatesNewEditFormExcel({ currentUserCertificates, Loading }) {
  const t = fa;
  const defaultValues = useMemo(
    () => ({
      file: currentUserCertificates?.file || null,
    }),
    [currentUserCertificates]
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;
  useEffect(() => {
    reset(defaultValues);
  }, [currentUserCertificates, reset, defaultValues]);
  const onSubmit = handleSubmit(async (data) => {
    try {
      const url = 'user-certificates/import-user-certificates';
      const formData = new FormData();
      if (data.file && typeof data.file !== 'string') {
        formData.append('file', data.file);
      }
      await AxiosComponent({
        method: 'post',
        url: `${BASE_LMS_API}/${url}`,
        data: formData,
        callback: (status) => {
          if (status) {
            reset();
            toast.success(
              currentUserCertificates
                ? t.dashboard.tableCommon.mesUpdate
                : t.dashboard.tableCommon.mesCreate
            );
            // router.push(paths.dashboard.userProducts.list);
          } else {
            toast.error(t.dashboard.tableCommon.mesError);
          }
        },
      });
    } catch (error) {
      console.error(error);
    }
  });
  const handleRemoveFile2 = useCallback(() => {
    setValue('file', null);
  }, [setValue]);
  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          {currentUserCertificates && Loading ? (
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
                <Box>
                  <Button
                    variant="outlined"
                    href="/file/New Microsoft Excel Worksheet (4) (1).xlsx"
                    download
                    fullWidth
                    sx={{ py: '16px' }}
                  >
                    نمونه فرمت
                  </Button>
                  <Typography sx={{ mt: '10px' }} variant="caption" display="block" gutterBottom>
                    این دکمه برای دانلود نمونه فرمت است. باید فرمت انتخابی مانند نمونه باشد
                  </Typography>
                </Box>
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">عکس</Typography>
                  <Field.Upload name="file" maxSize={3145728} onDelete={handleRemoveFile2} />
                </Stack>
              </Box>
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!currentUserCertificates
                    ? t.dashboard.tableCommon.create
                    : t.dashboard.tableCommon.edit}
                </LoadingButton>
              </Stack>
            </Card>
          )}
        </Grid>
      </Grid>
    </Form>
  );
}
