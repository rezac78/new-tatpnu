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
  Switch,
  MenuItem,
  Typography,
  InputLabel,
  FormControl,
  CircularProgress,
  FormControlLabel,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { AxiosComponent } from 'src/utils/AxiosComponent';

import fa from 'src/locales/fa';
import { BASE_LMS_API } from 'src/config-global';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { ProductSeasonsListView } from '../productSeasons/view';
import { ProductAttributeListView } from '../productAttribute/view';

export const NewUserSchema = zod.object({
  title: zod.string().min(1, { message: 'عنوان نباید خالی باشد' }),
  slug: zod.string().min(1, { message: 'اسلاگ نباید خالی باشد' }),
  category_id: zod.union([
    zod.string().min(1, { message: 'نباید خالی باشد' }),
    zod.number().min(1, { message: 'نباید خالی باشد' }),
  ]),
  description: zod.string().min(1, { message: 'توضیحات نباید خالی باشد' }),
  image: zod.any().refine(
    (file) => {
      if (!file) return false;
      if (typeof file === 'string') return true;
      const acceptedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/svg+xml'];
      return acceptedFormats.includes(file.type);
    },
    { message: 'فرمت تصویر باید یکی از png، svg، jpg، یا jpeg باشد و نباید خالی باشد.' }
  ),

  banner: zod.any().refine(
    (file) => {
      if (!file) return false;
      if (typeof file === 'string') return true;
      const acceptedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/svg+xml'];
      return acceptedFormats.includes(file.type);
    },
    { message: 'فرمت تصویر باید یکی از png، svg، jpg، یا jpeg باشد و نباید خالی باشد.' }
  ),

  is_active: zod.union([zod.boolean(), zod.number()]),
});

export function ProductsNewEditForm({ currentProducts, Loading }) {
  const router = useRouter();
  const t = fa;
  const [categoriesData, setCategoriesData] = useState([]);
  const defaultValues = useMemo(
    () => ({
      title: currentProducts?.title || '',
      slug: currentProducts?.slug || '',
      category_id: currentProducts?.category_id || '',
      image: currentProducts?.image || null,
      description: currentProducts?.description || '',
      is_active: currentProducts?.is_active ?? true,
      banner: currentProducts?.banner || null,
    }),
    [currentProducts]
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
    watch,
    control,
    formState: { isSubmitting, errors },
  } = methods;
  const getCategories = useCallback(async () => {
    await AxiosComponent({
      method: 'get',
      url: `${BASE_LMS_API}/categories`,
      callback: (status, data) => {
        if (status) {
          setCategoriesData(data.data);
        } else {
          toast.error(t.dashboard.tableCommon.mesDelete);
        }
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getCategories();
    reset(defaultValues);
  }, [currentProducts, reset, defaultValues, getCategories]);
  const submitHandler = useCallback(
    async (data, shouldRedirect = false) => {
      try {
        const url = !currentProducts
          ? `products/store`
          : `products/${currentProducts.id}?_method=PUT`;
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('slug', data.slug);
        formData.append('category_id', data.category_id);
        formData.append('description', data.description);
        formData.append('is_active', data.is_active ? '1' : '0');

        if (data.banner && typeof data.banner !== 'string') {
          formData.append('banner', data.banner);
        }
        if (data.image && typeof data.image !== 'string') {
          formData.append('image', data.image);
        }
        await AxiosComponent({
          method: 'post',
          url: `${BASE_LMS_API}/${url}`,
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
          callback: (status) => {
            if (status) {
              reset();
              toast.success(
                currentProducts
                  ? t.dashboard.tableCommon.mesUpdate
                  : t.dashboard.tableCommon.mesCreate
              );
              reset();
              if (shouldRedirect) {
                router.push(paths.dashboard.products.list);
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
    [currentProducts, router, reset, t]
  );
  const isActive = Boolean(watch('is_active'));
  const handleRemoveFile = useCallback(() => {
    setValue('banner', null);
  }, [setValue]);
  const handleRemoveFile2 = useCallback(() => {
    setValue('image', null);
  }, [setValue]);
  return (
    <Form methods={methods} onSubmit={handleSubmit((data) => submitHandler(data))}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          {currentProducts && Loading ? (
            <div className="flex items-center justify-center">
              <CircularProgress />
            </div>
          ) : (
            <>
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
                  <Field.Text name="title" label="عنوان" required />
                  <Field.Text name="slug" label="اسلاگ" required />
                  <Field.Text name="description" label="توضیحات" />
                  <FormControl fullWidth error={!!errors.category_id}>
                    <InputLabel required id="category-select-label">
                      انتخاب دسته بندی
                    </InputLabel>
                    <Controller
                      name="category_id"
                      control={control}
                      render={({ field }) => (
                        <Select
                          labelId="category-select-label"
                          id="category-select"
                          label="انتخاب دسته بندی"
                          {...field}
                        >
                          {categoriesData.map((item) => (
                            <MenuItem key={item.id} value={item.id.toString()}>
                              {item.title}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.category_id && (
                      <Typography color="error" variant="caption">
                        {errors.category_id.message}
                      </Typography>
                    )}
                  </FormControl>
                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2">بنر</Typography>
                    <Field.Upload name="banner" maxSize={3145728} onDelete={handleRemoveFile} />
                  </Stack>
                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2">عکس</Typography>
                    <Field.Upload name="image" maxSize={3145728} onDelete={handleRemoveFile2} />
                  </Stack>
                </Box>
                <FormControlLabel
                  control={
                    <Controller
                      name="is_active"
                      control={control}
                      render={({ field }) => <Switch {...field} checked={Boolean(field.value)} />}
                    />
                  }
                  label={isActive ? 'فعال' : 'غیرفعال'}
                  sx={{ pl: 3, flexGrow: 1 }}
                />
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton
                    type="button"
                    variant="contained"
                    loading={isSubmitting}
                    onClick={handleSubmit((data) => submitHandler(data, false))}
                  >
                    {!currentProducts
                      ? t.dashboard.tableCommon.create
                      : t.dashboard.tableCommon.edit}
                  </LoadingButton>
                  <LoadingButton
                    type="button"
                    variant="contained"
                    loading={isSubmitting}
                    onClick={handleSubmit((data) => submitHandler(data, true))}
                  >
                    {!currentProducts
                      ? t.dashboard.tableCommon.createAndExist
                      : t.dashboard.tableCommon.editAndExist}
                  </LoadingButton>
                </Stack>
              </Card>
              {!currentProducts && (
                <Card sx={{ p: 3, mt: 3, display: 'flex', justifyContent: 'center' }}>
                  {t.dashboard.tableCommon.help}
                </Card>
              )}
              {currentProducts && <ProductSeasonsListView ProductId={currentProducts.id} />}
              {currentProducts && <ProductAttributeListView ProductId={currentProducts.id} />}
            </>
          )}
        </Grid>
      </Grid>
    </Form>
  );
}
