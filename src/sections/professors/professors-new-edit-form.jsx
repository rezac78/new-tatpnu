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
  TextField,
  Typography,
  InputLabel,
  FormControl,
  CircularProgress,
} from '@mui/material';

import { useParams, useRouter } from 'src/routes/hooks';

import { AxiosComponent } from 'src/utils/AxiosComponent';

import fa from 'src/locales/fa';
import { BASE_LMS_API } from 'src/config-global';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

const Gender = [
  {
    id: 1,
    title: 'زن',
  },
  {
    id: 2,
    title: 'مرد',
  },
];
export const NewUserSchema = zod.object({
  fullname: zod.string().min(1, { message: 'عنوان نباید خالی باشد' }),
  gender: zod.union([
    zod.string().min(1, { message: 'نباید خالی باشد' }),
    zod.number().min(1, { message: 'نباید خالی باشد' }),
  ]),
  education: zod.string().min(1, { message: 'مدرک نباید خالی باشد' }),
  age: zod.preprocess(
    (value) => (typeof value === 'string' || typeof value === 'number' ? Number(value) : value),
    zod
      .number()
      .positive({ message: 'سن باید عدد مثبت باشد' })
      .int({ message: 'سن باید یک عدد صحیح باشد' })
      .max(120, { message: 'سن باید کمتر از 120 باشد' })
  ),
  description: zod.string().min(1, { message: 'توضیحات نباید خالی باشد' }),
  image: zod.any().refine((file) => {
    if (!file) return false;
    if (typeof file === 'string') return true;
    const acceptedFormats = ['image/jpeg', 'image/png', 'image/jpg'];
    return acceptedFormats.includes(file.type);
  }, { message: 'فرمت تصویر باید یکی از png، jpg، یا jpeg باشد و نباید خالی باشد.' }),
  product_id: zod.array(zod.string()).optional(),
});

export function ProfessorsNewEditForm({ currentProfessors, Loading }) {
  const router = useRouter();
  const { id = '' } = useParams();
  const t = fa;
  const [productsData, setProductsData] = useState([]);
  const defaultValues = useMemo(
    () => ({
      fullname: currentProfessors?.fullname || '',
      gender: !currentProfessors ? currentProfessors?.gender : currentProfessors?.gender_code || '',
      education: currentProfessors?.education || '',
      age: currentProfessors?.age || '',
      description: currentProfessors?.description || '',
      product_id: !currentProfessors
        ? currentProfessors?.id
        : currentProfessors.products?.map((e) => e.product_id.toString()) || [],
      image: currentProfessors?.image || null,
    }),
    [currentProfessors]
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
  }, [currentProfessors, reset, defaultValues, getProducts]);
  const submitHandler = useCallback(
    async (data, shouldRedirect = false) => {
      try {
        const url = !currentProfessors
          ? `professors/store`
          : `professors/${currentProfessors.id}?_method=PUT`;
        const formData = new FormData();
        formData.append('fullname', data.fullname);
        formData.append('gender', data.gender);
        formData.append('product_id', !currentProfessors ? id : data.product_id);
        formData.append('age', data.age);
        formData.append('description', data.description);
        formData.append('education', data.education);
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
                currentProfessors
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
    [currentProfessors, router, reset, t, id]
  );
  const handleRemoveFile2 = useCallback(() => {
    setValue('image', null);
  }, [setValue]);
  return (
    <Form methods={methods} onSubmit={handleSubmit((data) => submitHandler(data))}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          {currentProfessors && Loading ? (
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
                <Field.Text name="fullname" label="اسم" />
                <FormControl fullWidth error={!!errors.gender}>
                  <InputLabel id="category-select-label">دسته بندی جنسیت</InputLabel>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select
                        labelId="category-select-label"
                        id="category-select"
                        label="دسته بندی جنسیت"
                        {...field}
                      >
                        {Gender.map((item) => (
                          <MenuItem key={item.id} value={item.id.toString()}>
                            {item.title}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.gender && (
                    <Typography color="error" variant="caption">
                      {errors.gender.message}
                    </Typography>
                  )}
                </FormControl>
                <Field.Text name="education" label="مدرک" />
                <Controller
                  name="age"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="سن"
                      error={!!errors.age}
                      helperText={errors.age ? errors.age.message : ''}
                    />
                  )}
                />
                <Field.Text name="description" label="توضیحات" />
                {currentProfessors && (
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
                          multiple
                          {...field}
                        >
                          {productsData.map((item) => (
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
                )}
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2">عکس</Typography>
                  <Field.Upload name="image" maxSize={3145728} onDelete={handleRemoveFile2} />
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
                  {!currentProfessors ? t.dashboard.tableCommon.create : t.dashboard.tableCommon.edit}
                </LoadingButton>
                <LoadingButton
                  type="button"
                  variant="contained"
                  loading={isSubmitting}
                  onClick={handleSubmit((data) => submitHandler(data, true))}
                >
                  {!currentProfessors ? t.dashboard.tableCommon.createAndExist : t.dashboard.tableCommon.editAndExist}
                </LoadingButton>
              </Stack>
            </Card>
          )}
        </Grid>
      </Grid>
    </Form>
  );
}
