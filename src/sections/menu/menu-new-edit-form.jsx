import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { CircularProgress } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { AxiosComponent } from 'src/utils/AxiosComponent';

import fa from 'src/locales/fa';
import { BASE_LMS_API } from 'src/config-global';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const validationSchema = zod.object({
  title: zod.string().min(1, { message: 'عنوان نباید خالی باشد' }),
  slug: zod.string().min(1, { message: 'اسلاگ نباید خالی باشد' }),
});

// ----------------------------------------------------------------------

export function MenuNewEditForm({ currentMenu, Loading }) {
  const router = useRouter();
  const t = fa;

  const defaultValues = useMemo(
    () => ({
      title: currentMenu?.title || '',
      slug: currentMenu?.slug || '',
    }),
    [currentMenu]
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [currentMenu, reset, defaultValues]);

  const submitHandler = useCallback(
    async (data, shouldRedirect = false) => {
      try {
        const url = !currentMenu ? `menus/store` : `menus/${currentMenu.id}?_method=PUT`;
        await AxiosComponent({
          method: 'post',
          url: `${BASE_LMS_API}/${url}`,
          data,
          callback: (status) => {
            if (status) {
              reset();
              toast.success(
                currentMenu ? t.dashboard.tableCommon.mesUpdate : t.dashboard.tableCommon.mesCreate
              );
              reset();
              if (shouldRedirect) {
                router.push(paths.dashboard.menu.list);
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
    [currentMenu, router, reset, t]
  );

  return (
    <Form methods={methods} onSubmit={handleSubmit((data) => submitHandler(data))}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          {currentMenu && Loading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
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
                <Field.Text name="title" label="عنوان" />
                <Field.Text name="slug" label="اسلاگ" />
              </Box>

              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                sx={{ mt: 3 }}
              >
                <LoadingButton
                  type="button"
                  variant="contained"
                  loading={isSubmitting}
                  onClick={handleSubmit((data) => submitHandler(data, false))}
                >
                  {!currentMenu ? t.dashboard.tableCommon.create : t.dashboard.tableCommon.edit}
                </LoadingButton>
                <LoadingButton
                  type="button"
                  variant="contained"
                  loading={isSubmitting}
                  onClick={handleSubmit((data) => submitHandler(data, true))}
                >
                  {!currentMenu ? t.dashboard.tableCommon.createAndExist : t.dashboard.tableCommon.editAndExist}
                </LoadingButton>
              </Stack>
            </Card>
          )}
        </Grid>
      </Grid>
    </Form>
  );
}
