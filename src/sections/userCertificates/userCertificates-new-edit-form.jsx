import { z as zod } from 'zod';
import DatePicker from 'react-multi-date-picker';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useEffect, useCallback } from 'react';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { TextField, Typography, IconButton, InputAdornment, CircularProgress } from '@mui/material';

import { AxiosComponent } from 'src/utils/AxiosComponent';

import fa from 'src/locales/fa';
import { BASE_LMS_API } from 'src/config-global';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------
const mobilePattern = /^(\+98|0)?9\d{9}$/;
const validateIranianNationalCode = (input) => {
  if (!/^\d{10}$/.test(input)) return false;
  const check = +input[9];
  const sum = Array.from(input)
    .slice(0, 9)
    .reduce((acc, digit, index) => acc + +digit * (10 - index), 0);
  const remainder = sum % 11;
  return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
};
export const NewUserSchema = zod.object({
  phone_number: zod
    .string()
    .min(1, { message: 'عنوان نباید خالی باشد' })
    .regex(mobilePattern, { message: 'شماره موبایل معتبر نیست' }),
  product_name: zod.string().min(1, { message: 'نباید خالی باشد' }),
  image: schemaHelper.file({ message: { required_error: 'نباید خالی باشد' } }),
  ncode: zod
    .string()
    .min(1, { message: 'نباید خالی باشد' })
    .refine((value) => validateIranianNationalCode(value), { message: 'کد ملی معتبر نیست' }),
  first_name: zod.string().min(1, { message: 'نباید خالی باشد' }),
  last_name: zod.string().min(1, { message: 'نباید خالی باشد' }),
  issue_date: zod.string().min(1, { message: 'نباید خالی باشد' }),
});

// ----------------------------------------------------------------------

export function UserCertificatesNewEditForm({ currentUserCertificates, Loading }) {
  const t = fa;
  const defaultValues = useMemo(
    () => ({
      phone_number: !currentUserCertificates
        ? currentUserCertificates?.phone_number
        : currentUserCertificates?.user_mobile || '',
      product_name: currentUserCertificates?.product_name || '',
      image: currentUserCertificates?.image || null,
      ncode: currentUserCertificates?.ncode || '',
      issue_date: currentUserCertificates?.issue_date || '',
      first_name: !currentUserCertificates
        ? currentUserCertificates?.first_name
        : currentUserCertificates?.user_name || '',
      last_name: currentUserCertificates?.last_name || '',
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
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;
  useEffect(() => {
    reset(defaultValues);
  }, [currentUserCertificates, reset, defaultValues]);
  const submitHandler = useCallback(
    async (data, shouldRedirect = false) => {
      try {
        const url = !currentUserCertificates
          ? `user-certificates/store`
          : `user-certificates/${currentUserCertificates.id}?_method=PUT`;
        const formData = new FormData();
        const DigitsDate = data.issue_date.replace(/[۰-۹]/g, (digit) =>
          String.fromCharCode(digit.charCodeAt(0) - 1728)
        );
        formData.append('phone_number', data.phone_number);
        formData.append('product_name', data.product_name);
        formData.append('ncode', data.ncode);
        formData.append('issue_date', DigitsDate);
        formData.append('first_name', data.first_name);
        formData.append('last_name', data.last_name);
        if (data.image && typeof data.image !== 'string') {
          formData.append('image', data.image);
        }
        await AxiosComponent({
          method: 'post',
          url: `${BASE_LMS_API}/${url}`,
          data: formData,
          callback: (status, data2) => {
            if (data2.id != null) {
              reset();
              toast.success(
                currentUserCertificates
                  ? t.dashboard.tableCommon.mesUpdate
                  : t.dashboard.tableCommon.mesCreate
              );
              reset();
              if (shouldRedirect) { /* empty */ }
            }
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
    [currentUserCertificates, reset, t]
  );
  const handleDateClear = useCallback(
    (issue_date) => {
      setValue(issue_date, '');
    },
    [setValue]
  );
  const handleRemoveFile2 = useCallback(() => {
    setValue('image', null);
  }, [setValue]);
  return (
    <Form methods={methods} onSubmit={handleSubmit((data) => submitHandler(data))}>
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
                <>
                  <Field.Text name="phone_number" label="موبایل" />
                  <Field.Text name="product_name" label="عنوان" />
                  <Field.Text name="ncode" label="کدملی" />
                  <Controller
                    name="issue_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        calendar={persian}
                        locale={persian_fa}
                        portal
                        calendarPosition="bottom-right"
                        style={{ width: '100%', padding: '16.5px 14px' }}
                        onChange={(date) => field.onChange(date ? date.format('YYYY/MM/DD') : '')}
                        render={(value, openCalendar) => (
                          <TextField
                            fullWidth
                            onClick={openCalendar}
                            value={value || ''}
                            label="تاریخ"
                            variant="outlined"
                            size="medium"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={() => handleDateClear('issue_date')}>
                                    x
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            readOnly
                          />
                        )}
                      />
                    )}
                  />
                  <Field.Text name="first_name" label="نام" />
                  <Field.Text name="last_name" label="نام خوانوادگی" />
                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2">عکس</Typography>
                    <Field.Upload name="image" maxSize={3145728} onDelete={handleRemoveFile2} />
                  </Stack>
                </>
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
                  {!currentUserCertificates ? t.dashboard.tableCommon.create : t.dashboard.tableCommon.edit}
                </LoadingButton>
                <LoadingButton
                  type="button"
                  variant="contained"
                  loading={isSubmitting}
                  onClick={handleSubmit((data) => submitHandler(data, true))}
                >
                  {!currentUserCertificates ? t.dashboard.tableCommon.createAndExist : t.dashboard.tableCommon.editAndExist}
                </LoadingButton>
              </Stack>
            </Card>
          )}
        </Grid>
      </Grid>
    </Form>
  );
}
