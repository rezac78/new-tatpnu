/* eslint-disable no-restricted-globals */
import { z as zod } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useEffect,useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Switch,
  Select,
  MenuItem,
  InputLabel,
  Typography,
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

export const NewUserSchema = zod.object({
  title: zod.string().min(1, { message: 'عنوان نباید خالی باشد' }),
  type: zod.union([
    zod.string().min(1, { message: 'نباید خالی باشد' }),
    zod.number().min(1, { message: 'نباید خالی باشد' }),
  ]),
  duration: zod
    .union([zod.string(), zod.number()])
    .refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
      message: 'مدت زمان باید عدد باشد',
    }),
  active: zod.union([zod.boolean(), zod.number()]),
  passing_score: zod
    .union([zod.string(), zod.number()])
    .refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
      message: 'نمره قبولی باید عدد باشد',
    }),
  total_score: zod
    .union([zod.string(), zod.number()])
    .refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
      message: 'نمره کلی باید عدد باشد',
    }),
  count_question: zod
    .union([zod.string(), zod.number()])
    .refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
      message: 'تعداد کل سوالات باید عدد باشد',
    }),
  time_exam_repeat: zod.string().min(1, { message: 'نباید خالی باشد' }),
  time_exam: zod.string().min(1, { message: 'نباید خالی باشد' }),
  exam_repeat: zod
    .union([zod.string(), zod.number()])
    .refine((value) => !isNaN(Number(value)) && Number(value) > 0, { message: 'باید عدد باشد' }),
});
const TypeExam = [
  {
    id: 1,
    title: '2',
  },
  {
    id: 2,
    title: '3',
  },
  {
    id: 3,
    title: '4',
  },
  {
    id: 4,
    title: '5',
  },
];
const TimeExamRepeat = [
  {
    id: 1,
    title: '12',
  },
  {
    id: 2,
    title: '24',
  },
  {
    id: 3,
    title: '48',
  },
  {
    id: 4,
    title: '72',
  },
  {
    id: 5,
    title: '96',
  },
];
const TimeExam = [
  {
    id: 1,
    title: '00:10:00',
  },
  {
    id: 2,
    title: '00:25:00',
  },
  {
    id: 3,
    title: '00:45:00',
  },
  {
    id: 4,
    title: '01:00:00',
  },
  {
    id: 5,
    title: '01:30:00',
  },
];
export function ExamNewEditForm({ currentExam, Loading }) {
  const router = useRouter();
  const t = fa;
  const defaultValues = useMemo(
    () => ({
      title: currentExam?.title || '',
      type: currentExam?.type || '',
      duration: currentExam?.duration || '',
      active: currentExam?.active ?? true,
      passing_score: currentExam?.passing_score || '',
      total_score: currentExam?.total_score || '',
      count_question: currentExam?.count_question || '',
      time_exam_repeat: currentExam?.time_exam_repeat || '',
      time_exam: currentExam?.time_exam || '',
      exam_repeat: currentExam?.exam_repeat || '',
    }),
    [currentExam]
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
    watch,
    formState: { isSubmitting, errors },
  } = methods;
  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  const submitHandler = useCallback(
    async (data, shouldRedirect = false) => {
      try {
        const url = !currentExam ? `exams/store` : `exams/${currentExam.id}?_method=PUT`;
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('type', data.type);
        formData.append('duration', data.duration);
        formData.append('active', data.active ? '1' : '0');
        formData.append('passing_score', data.passing_score);
        formData.append('total_score', data.total_score);
        formData.append('count_question', data.count_question);
        formData.append('time_exam_repeat', data.time_exam_repeat);
        formData.append('time_exam', data.time_exam);
        formData.append('exam_repeat', data.exam_repeat);
        await AxiosComponent({
          method: 'post',
          url: `${BASE_LMS_API}/${url}`,
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
          callback: (status) => {
            if (status) {
              reset();
              toast.success(
                currentExam ? t.dashboard.tableCommon.mesUpdate : t.dashboard.tableCommon.mesCreate
              );
              reset();
              if (shouldRedirect) {
                router.push(paths.dashboard.exam.list);
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
    [currentExam, router, reset, t]
  );
  const isActive = Boolean(watch('active'));

  return (
    <Form methods={methods} onSubmit={handleSubmit((data) => submitHandler(data))}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          {currentExam && Loading ? (
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
                <FormControl fullWidth error={!!errors.type}>
                  <InputLabel id="category-select-label">دسته بندی نوع آزمون</InputLabel>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        labelId="category-select-label"
                        id="category-select"
                        label="دسته بندی نوع آزمون"
                        {...field}
                      >
                        {TypeExam.map((item) => (
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
                <Field.Text name="duration" label="مدت زمان" />
                <Field.Text name="passing_score" label="نمره قبولی" />
                <Field.Text name="total_score" label="نمره کامل" />
                <Field.Text name="count_question" label="کل سوالات" />
                <FormControl fullWidth error={!!errors.time_exam_repeat}>
                  <InputLabel id="category-select-label">دسته بندی مدت زمان تکرار آزمون</InputLabel>
                  <Controller
                    name="time_exam_repeat"
                    control={control}
                    render={({ field }) => (
                      <Select
                        labelId="category-select-label"
                        id="category-select"
                        label="دسته بندی مدت زمان تکرار آزمون"
                        {...field}
                      >
                        {TimeExamRepeat.map((item) => (
                          <MenuItem key={item.id} value={item.id.toString()}>
                            {item.title}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.time_exam_repeat && (
                    <Typography color="error" variant="caption">
                      {errors.time_exam_repeat.message}
                    </Typography>
                  )}
                </FormControl>
                <FormControl fullWidth error={!!errors.time_exam}>
                  <InputLabel id="category-select-label">دسته بندی تایم امتحان</InputLabel>
                  <Controller
                    name="time_exam"
                    control={control}
                    render={({ field }) => (
                      <Select
                        labelId="category-select-label"
                        id="category-select"
                        label="دسته بندی تایم امتحان"
                        {...field}
                      >
                        {TimeExam.map((item) => (
                          <MenuItem key={item.id} value={item.title}>
                            {item.title}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.time_exam && (
                    <Typography color="error" variant="caption">
                      {errors.time_exam.message}
                    </Typography>
                  )}
                </FormControl>{' '}
                <Field.Text name="exam_repeat" label="تعداد تکرار آزمون" />
                <FormControlLabel
                  control={
                    <Controller
                      name="active"
                      control={control}
                      render={({ field }) => <Switch {...field} checked={Boolean(field.value)} />}
                    />
                  }
                  label={isActive ? 'فعال' : 'غیرفعال'}
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
                  {!currentExam ? t.dashboard.tableCommon.create : t.dashboard.tableCommon.edit}
                </LoadingButton>
                <LoadingButton
                  type="button"
                  variant="contained"
                  loading={isSubmitting}
                  onClick={handleSubmit((data) => submitHandler(data, true))}
                >
                  {!currentExam
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
