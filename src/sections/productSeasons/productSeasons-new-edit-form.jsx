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
  InputLabel,
  Typography,
  FormControl,
  CircularProgress,
} from '@mui/material';

import { useParams } from 'src/routes/hooks';

import { AxiosComponent } from 'src/utils/AxiosComponent';

import fa from 'src/locales/fa';
import { BASE_LMS_API } from 'src/config-global';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewUserSchema = zod.object({
  title: zod.string().min(1, { message: 'عنوان نباید خالی باشد' }),
  product_id: zod.union([
    zod.string().min(1, { message: 'نباید خالی باشد' }),
    zod.number().min(1, { message: 'نباید خالی باشد' }),
  ]),
  sort_item: zod.union([
    zod.string().min(1, { message: 'نباید خالی باشد' }),
    zod.number().min(1, { message: 'نباید خالی باشد' }),
  ]),
});

// ----------------------------------------------------------------------

export function ProductSeasonsNewEditForm({ currentProduct, onSuccess, getUserProducts, Loading }) {
  const t = fa;
  const [menuProducts, setProductsData] = useState([]);
  const { id = '' } = useParams();
  const defaultValues = useMemo(
    () => ({
      title: currentProduct?.title || '',
      product_id: currentProduct?.product_id || (id ? id.toString() : ''),
      sort_item: currentProduct?.sort || '',
    }),
    [currentProduct, id]
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });
  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const getProduct = useCallback(async () => {
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
    getProduct();
    reset(defaultValues);
  }, [currentProduct, reset, defaultValues, getProduct]);

  const submitHandler = useCallback(
    async (data, shouldRedirect = false) => {
      try {
        const url = !currentProduct
          ? `product-season/store`
          : `product-season/${currentProduct.id}?_method=PUT`;
        await AxiosComponent({
          method: 'post',
          url: `${BASE_LMS_API}/${url}`,
          data: {
            id: data.id,
            product_id: data.product_id,
            sort: data.sort_item,
            title: data.title,
          },
          callback: (status) => {
            if (status) {
              reset();
              toast.success(
                currentProduct
                  ? t.dashboard.tableCommon.mesUpdate
                  : t.dashboard.tableCommon.mesCreate
              );
              reset();
              getUserProducts();
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
    [currentProduct, reset, t, onSuccess, getUserProducts]
  );

  return (
    <Form methods={methods} onSubmit={handleSubmit((data) => submitHandler(data))}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          {currentProduct && Loading ? (
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
                        disabled={!currentProduct}
                        value={field.value || (!currentProduct ? id.toString() : '')}
                      >
                        {!currentProduct
                          ? menuProducts
                            .filter((val) => val.id === Number(id))
                            .map((item) => (
                              <MenuItem key={item.id} value={item.id.toString()}>
                                {item.title}
                              </MenuItem>
                            ))
                          : menuProducts.map((item) => (
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
                <Field.Text name="sort_item" label="ترتیب" />
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
                  {!currentProduct ? t.dashboard.tableCommon.create : t.dashboard.tableCommon.edit}
                </LoadingButton>
                <LoadingButton
                  type="button"
                  variant="contained"
                  loading={isSubmitting}
                  onClick={handleSubmit((data) => submitHandler(data, true))}
                >
                  {!currentProduct ? t.dashboard.tableCommon.createAndExist : t.dashboard.tableCommon.editAndExist}
                </LoadingButton>
              </Stack>
            </Card>
          )}
        </Grid>
      </Grid>
    </Form>
  );
}
