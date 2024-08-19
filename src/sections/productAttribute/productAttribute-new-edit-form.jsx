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

import { useParams } from 'src/routes/hooks';

import { AxiosComponent } from 'src/utils/AxiosComponent';

import fa from 'src/locales/fa';
import { BASE_LMS_API } from 'src/config-global';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

export const NewUserSchema = zod.object({
  value: zod.string().min(1, { message: 'عنوان نباید خالی باشد' }),
  key: zod.string().min(1, { message: 'اسلاگ نباید خالی باشد' }),
  product_id: zod.union([
    zod.string().min(1, { message: 'نباید خالی باشد' }),
    zod.number().min(1, { message: 'نباید خالی باشد' }),
  ]),
  priority: zod
    .string()
    // eslint-disable-next-line no-restricted-globals
    .refine((value) => !isNaN(value) && Number(value) > 0, { message: 'اولویت باید عدد باشد' }),
  icon: schemaHelper.file({ message: { required_error: 'نباید خالی باشد' } }),
});

export function ProductAttributeNewEditForm({ currentAttributes, onSuccess, getProductAttributes, Loading }) {
  const t = fa;
  const { id = '' } = useParams();
  const [productsData, setProductsData] = useState([]);
  const defaultValues = useMemo(
    () => ({
      value: currentAttributes?.value || '',
      key: currentAttributes?.key || '',
      product_id: currentAttributes?.product_id || (id ? id.toString() : ''),
      icon: currentAttributes?.icon || null,
      priority: currentAttributes?.priority || '',
    }),
    [currentAttributes, id]
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
  const getProducts = useCallback(async () => {
    await AxiosComponent({
      method: 'get',
      url: `${BASE_LMS_API}/products`,
      callback: (status, data) => {
        if (status) {
          setProductsData(data.data);
        } else {
          toast.error(t.dashboard.tableCommon.mesDelete);
        }
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getProducts();
    reset(defaultValues);
  }, [currentAttributes, reset, defaultValues, getProducts]);

  const submitHandler = useCallback(
    async (data, shouldRedirect = false) => {
      try {
        const url = !currentAttributes
          ? `product-attribute`
          : `product-attribute/${currentAttributes.id}?_method=PUT`;
        const formData = new FormData();
        formData.append('value', data.value);
        formData.append('key', data.key);
        formData.append('product_id', data.product_id);
        formData.append('priority', data.priority);
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
              reset();
              toast.success(
                currentAttributes
                  ? t.dashboard.tableCommon.mesUpdate
                  : t.dashboard.tableCommon.mesCreate
              );
              reset();
              getProductAttributes();
              if (shouldRedirect) {
                onSuccess();
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
    [currentAttributes, reset, t, onSuccess, getProductAttributes]
  );
  const handleRemoveFile2 = useCallback(() => {
    setValue('icon', null);
  }, [setValue]);
  return (
    <Form methods={methods} onSubmit={handleSubmit((data) => submitHandler(data))}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          {currentAttributes && Loading ? (
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
                <Field.Text name="key" label="عنوان" />
                <Field.Text name="value" label="توضیحات" />
                <Field.Text name="priority" label="اولویت" />
                <FormControl fullWidth error={!!errors.product_id}>
                  <InputLabel id="category-select-label">دسته بندی محصولات</InputLabel>
                  <Controller
                    name="product_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        labelId="category-select-label"
                        id="category-select"
                        label="دسته بندی محصولات"
                        {...field}
                        disabled={!currentAttributes}
                        value={field.value || (!currentAttributes ? id.toString() : '')}
                      >
                        {!currentAttributes
                          ? productsData
                            .filter((val) => val.id === Number(id))
                            .map((item) => (
                              <MenuItem key={item.id} value={item.id.toString()}>
                                {item.title}
                              </MenuItem>
                            ))
                          : productsData.map((item) => (
                            <MenuItem key={item.id} value={item.id.toString()}>
                              {item.title}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                  {errors.product_id && (
                    <Typography color="error" variant="caption">
                      {errors.product_id.message}
                    </Typography>
                  )}
                </FormControl>
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">عکس</Typography>
                  <Field.Upload name="icon" maxSize={3145728} onDelete={handleRemoveFile2} />
                </Stack>
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
                  {!currentAttributes ? t.dashboard.tableCommon.create : t.dashboard.tableCommon.edit}
                </LoadingButton>
                <LoadingButton
                  type="button"
                  variant="contained"
                  loading={isSubmitting}
                  onClick={handleSubmit((data) => submitHandler(data, true))}
                >
                  {!currentAttributes ? t.dashboard.tableCommon.createAndExist : t.dashboard.tableCommon.editAndExist}
                </LoadingButton>
              </Stack>
            </Card>
          )}
        </Grid>
      </Grid>
    </Form>
  );
}
