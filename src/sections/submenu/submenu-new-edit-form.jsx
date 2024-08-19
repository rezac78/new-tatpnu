import { z as zod } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Select,
  MenuItem,
  Typography,
  InputLabel,
  FormControl,
  CircularProgress,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { AxiosComponent } from 'src/utils/AxiosComponent';

import fa from 'src/locales/fa';
import { BASE_LMS_API, BASE_LMS_IMAGE } from 'src/config-global';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

export const NewUserSchema = zod.object({
  title: zod.string().min(1, { message: 'عنوان نباید خالی باشد' }),
  slug: zod.string().min(1, { message: 'اسلاگ نباید خالی باشد' }),
  menu_id: zod.union([
    zod.string().min(1, { message: 'نباید خالی باشد' }),
    zod.number().min(1, { message: 'نباید خالی باشد' }),
  ]),
  description: zod.string().min(1, { message: 'توضیحات نباید خالی باشد' }),
  icon: zod.any().refine(
    (file) => {
      if (!file) return false;
      if (typeof file === 'string') return true;
      const acceptedFormats = ['image/jpeg', 'image/png', 'image/jpg'];
      return acceptedFormats.includes(file.type);
    },
    { message: 'فرمت تصویر باید یکی از png، jpg، یا jpeg باشد و نباید خالی باشد.' }
  ),
});

export function SubMenuNewEditForm({ currentSubMenu, Loading }) {
  const router = useRouter();
  const t = fa;
  const [menuData, setMenuData] = useState([]);

  const defaultValues = useMemo(
    () => ({
      title: currentSubMenu?.title || '',
      slug: currentSubMenu?.slug || '',
      menu_id: currentSubMenu?.menu_id || '',
      description: currentSubMenu?.description || '',
      icon: currentSubMenu?.icon ? BASE_LMS_IMAGE + currentSubMenu.icon : null,
    }),
    [currentSubMenu]
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
    control,
    formState: { isSubmitting, errors },
  } = methods;

  const getMenus = useCallback(async () => {
    await AxiosComponent({
      method: 'get',
      url: `${BASE_LMS_API}/menus`,
      callback: (status, data) => {
        if (status) {
          setMenuData(data.data);
        } else {
          toast.error(t.dashboard.tableCommon.mesDelete);
        }
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getMenus();
    reset(defaultValues);
  }, [currentSubMenu, reset, defaultValues, getMenus]);

  const submitHandler = async (data, shouldRedirect) => {
    try {
      const url = !currentSubMenu
        ? `sub-menus/store`
        : `sub-menus/${currentSubMenu.id}?_method=PUT`;
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('slug', data.slug);
      formData.append('menu_id', data.menu_id);
      formData.append('description', data.description);

      if (data.icon && typeof data.icon !== 'string') {
        formData.append('icon', data.icon);
      }

      await AxiosComponent({
        method: 'post',
        url: `${BASE_LMS_API}/${url}`,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
        callback: (status) => {
          if (status) {
            toast.success(
              currentSubMenu ? t.dashboard.tableCommon.mesUpdate : t.dashboard.tableCommon.mesCreate
            );
            reset();
            if (shouldRedirect) {
              router.push(paths.dashboard.submenu.list);
            }
          } else {
            toast.error(t.dashboard.tableCommon.mesError);
          }
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveFile2 = useCallback(() => {
    setValue('icon', null);
  }, [setValue]);

  return (
    <Form methods={methods} onSubmit={handleSubmit((data) => submitHandler(data, false))}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          {currentSubMenu && Loading ? (
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
                <Field.Text name="title" label="عنوان" />
                <Field.Text name="slug" label="اسلاگ" />
                <Field.Text name="description" label="توضیحات" />
                <FormControl fullWidth error={!!errors.menu_id}>
                  <InputLabel id="menu-select-label">دسته بندی منو</InputLabel>
                  <Controller
                    name="menu_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        labelId="menu-select-label"
                        id="menu-select"
                        label="دسته بندی منو"
                        {...field}
                      >
                        {menuData.map((item) => (
                          <MenuItem key={item.id} value={item.id.toString()}>
                            {item.title}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.menu_id && (
                    <Typography color="error" variant="caption">
                      {errors.menu_id.message}
                    </Typography>
                  )}
                </FormControl>
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">ایکون</Typography>
                  <Field.Upload name="icon" maxSize={3145728} onDelete={handleRemoveFile2} />
                </Stack>
              </Box>
              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  type="button"
                  variant="contained"
                  loading={isSubmitting}
                  onClick={handleSubmit((data) => submitHandler(data, false))}
                >
                  {!currentSubMenu ? t.dashboard.tableCommon.create : t.dashboard.tableCommon.edit}
                </LoadingButton>
                <LoadingButton
                  type="button"
                  variant="contained"
                  loading={isSubmitting}
                  onClick={handleSubmit((data) => submitHandler(data, true))}
                >
                  {!currentSubMenu
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
