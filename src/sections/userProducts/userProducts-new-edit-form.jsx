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

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { AxiosComponent } from 'src/utils/AxiosComponent';

import fa from 'src/locales/fa';
import { BASE_LMS_API } from 'src/config-global';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------
const mobilePattern = /^(\+98|0)?9\d{9}$/;
export const NewUserSchema = zod.object({
  mobile: zod
    .string()
    .min(1, { message: 'عنوان نباید خالی باشد' })
    .regex(mobilePattern, { message: 'شماره موبایل معتبر نیست' }),
  product_id: zod.union([
    zod.string().min(1, { message: 'نباید خالی باشد' }),
    zod.number().min(1, { message: 'نباید خالی باشد' }),
  ]),
  type: zod.union([
    zod.string().min(1, { message: 'نباید خالی باشد' }),
    zod.number().min(1, { message: 'نباید خالی باشد' }),
  ]),
});

// ----------------------------------------------------------------------

export function UserProductsNewEditForm({ currentUserProducts, Loading }) {
  const router = useRouter();
  const t = fa;
  const TypeValues = [
    {
      id: '1',
      title: 'کاربران',
    },
    {
      id: '2',
      title: 'معلم',
    },
    {
      id: '3',
      title: 'دستیار آموزش',
    },
  ];
  const [menuProducts, setProductsData] = useState([]);
  const defaultValues = useMemo(
    () => ({
      mobile: currentUserProducts?.mobile || '',
      product_id: currentUserProducts?.product_id || '',
      type: !currentUserProducts ? currentUserProducts?.type : currentUserProducts?.type_code || '',
    }),
    [currentUserProducts]
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
  }, [currentUserProducts, reset, defaultValues, getProduct]);

  const submitHandler = useCallback(
    async (data, shouldRedirect = false) => {
      try {
        const url = !currentUserProducts
          ? `user-products/store`
          : `user-products/${currentUserProducts.id}?_method=PUT`;
        await AxiosComponent({
          method: 'post',
          url: `${BASE_LMS_API}/${url}`,
          data,
          callback: (status) => {
            if (status) {
              reset();
              toast.success(
                currentUserProducts
                  ? t.dashboard.tableCommon.mesUpdate
                  : t.dashboard.tableCommon.mesCreate
              );
              reset();
              if (shouldRedirect) {
                router.push(paths.dashboard.userProducts.list);
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
    [currentUserProducts, reset, t, router]
  );
  return (
    <Form methods={methods} onSubmit={handleSubmit((data) => submitHandler(data))}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          {currentUserProducts && Loading ? (
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
                <Field.Text name="mobile" label="موبایل" />
                <FormControl fullWidth error={!!errors.product_id}>
                  <InputLabel id="menu-select-label">لیست محصولات</InputLabel>
                  <Controller
                    name="product_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        labelId="menu-select-label"
                        id="menu-select"
                        label="لیست محصولات"
                        {...field}
                      >
                        {menuProducts.map((item) => (
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
                <FormControl fullWidth error={!!errors.type}>
                  <InputLabel id="menu-select-label">نقش کاربر</InputLabel>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        labelId="menu-select-label"
                        id="menu-select"
                        label="نقش کاربر"
                        {...field}
                      >
                        {TypeValues.map((item) => (
                          <MenuItem key={item.id} value={item.id.toString()}>
                            {item.title}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.type && (
                    <Typography color="error" variant="caption">
                      {errors.type.message}
                    </Typography>
                  )}
                </FormControl>
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
                  {!currentUserProducts ? t.dashboard.tableCommon.create : t.dashboard.tableCommon.edit}
                </LoadingButton>
                <LoadingButton
                  type="button"
                  variant="contained"
                  loading={isSubmitting}
                  onClick={handleSubmit((data) => submitHandler(data, true))}
                >
                  {!currentUserProducts ? t.dashboard.tableCommon.createAndExist : t.dashboard.tableCommon.editAndExist}
                </LoadingButton>
              </Stack>
            </Card>
          )}
        </Grid>
      </Grid>
    </Form>
  );
}
