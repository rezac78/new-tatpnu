/* eslint-disable no-restricted-globals */
import { useForm, Controller } from 'react-hook-form';
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
  FormLabel,
  InputLabel,
  Typography,
  FormControl,
  CircularProgress,
  FormControlLabel,
} from '@mui/material';

import { useParams, useRouter } from 'src/routes/hooks';

import { AxiosComponent } from 'src/utils/AxiosComponent';

import fa from 'src/locales/fa';
import { BASE_LMS_API } from 'src/config-global';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { UploadMultiFile } from 'src/components/upload';

export function ProductSectionsNewEditForm({ currentProductsSections, Loading }) {
  const t = fa;
  const ID = useParams();
  const router = useRouter();
  const [previewsFile, setPreviewsFile] = useState([]);
  const [, setPicsFile] = useState([]);
  const [previewsExerciseFile, setPreviewsExerciseFile] = useState([]);
  const [, setPicsExerciseFile] = useState([]);
  const [TypeValues, setTypeValues] = useState([
    {
      id: '1',
      title: 'فایل',
    },
    {
      id: '2',
      title: 'فیلم',
    },
    {
      id: '3',
      title: 'آزمون',
    },
    {
      id: '4',
      title: 'تمرین',
    },
  ]);
  const [menuExam, setExamData] = useState([]);
  const defaultValues = useMemo(
    () => ({
      title: currentProductsSections?.title || '',
      product_season_id: !currentProductsSections ? ID.session_id : ID.product_id,
      description: currentProductsSections?.description || '',
      type: !currentProductsSections
        ? currentProductsSections?.type
        : currentProductsSections?.type_code || '',
      slug: currentProductsSections?.slug || '',
      priority: currentProductsSections?.priority || '',
      is_public: currentProductsSections?.is_public ?? false,
      study_time: currentProductsSections?.study_time || '',
      active: currentProductsSections?.active ?? true,
      file: currentProductsSections?.params?.file || null,
      video: currentProductsSections?.params?.video || null,
      exam_id: !currentProductsSections
        ? currentProductsSections?.exam_id
        : currentProductsSections?.params?.id || '',
      exercise_title: !currentProductsSections
        ? currentProductsSections?.exercise_title
        : currentProductsSections?.params?.title || '',
      exercise_description: !currentProductsSections
        ? currentProductsSections?.exercise_description
        : currentProductsSections?.params?.description || '',
      exercise_file: !currentProductsSections
        ? currentProductsSections?.params?.exercise_file
        : currentProductsSections?.params?.file || null,
      exercise_count: !currentProductsSections
        ? currentProductsSections?.exercise_count
        : currentProductsSections?.params?.count || '',
    }),
    [ID.product_id, ID.session_id, currentProductsSections]
  );

  const methods = useForm({
    mode: 'onSubmit',
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;
  const getProduct = useCallback(async () => {
    await AxiosComponent({
      method: 'get',
      url: `${BASE_LMS_API}/exams`,
      callback: (status, data) => {
        if (status) {
          setExamData(data.data);
        }
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getProduct();
    reset(defaultValues);
  }, [currentProductsSections, reset, defaultValues, getProduct]);

  const handleDropFile = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
        setPreviewsFile([file.preview]);
        setPicsFile([file]);
        setValue('file', file);
      }
    },
    [setPicsFile, setPreviewsFile, setValue]
  );
  const handleDropExerciseFile = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
        setPreviewsExerciseFile([file.preview]);
        setPicsExerciseFile([file]);
        setValue('exercise_file', file);
      }
    },
    [setPicsExerciseFile, setPreviewsExerciseFile, setValue]
  );

  const validateForm = (data) => {
    // eslint-disable-next-line no-shadow
    const errors = {};
    if (!data.title) {
      errors.title = 'عنوان نباید خالی باشد';
    }
    if (!data.description) {
      errors.description = 'توضیحات نباید خالی باشد';
    }
    if (!data.type) {
      errors.type = 'دسته بندی نوع نباید خالی باشد';
    }
    if (!data.slug) {
      errors.slug = 'اسلاگ نباید خالی باشد';
    }
    if (!data.priority || isNaN(Number(data.priority)) || Number(data.priority) <= 0) {
      errors.priority = ' اولویت باید عدد باشد';
    }
    if (!data.study_time || isNaN(Number(data.study_time)) || Number(data.study_time) <= 0) {
      errors.study_time = ' تایم مطالعه باید عدد باشد';
    }
    if (data.type === '1' && (!data.file || !(data.file instanceof File))) {
      errors.file = 'فیلد فایل برای نوع فایل اجباری است';
    }

    if (data.type === '2' && !data.video) {
      errors.video = 'لینک فیلم اجباری است';
    }

    if (data.type === '3' && !data.exam_id) {
      errors.exam_id = 'فیلد نوع آزمون برای دسته بندی آزمون اجباری است';
    }

    if (
      data.type === '4' &&
      (!data.exercise_title ||
        !data.exercise_description ||
        !data.exercise_file ||
        !data.exercise_count)
    ) {
      errors.exercise_title =
        'فیلدهای عنوان تمرین و توضیحات تمرین برای دسته بندی تمرین اجباری هستند';
    }
    return errors;
  };

  const submitHandler = useCallback(
    async (data, shouldRedirect = false) => {
      const validationErrors = validateForm(data);
      if (Object.keys(validationErrors).length > 0) {
        Object.entries(validationErrors).forEach(([key, value]) => {
          toast.error(value);
        });
        return;
      }
      try {
        const url = !currentProductsSections
          ? `product-sections/store`
          : `product-sections/${currentProductsSections.id}?_method=PUT`;
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('product_season_id', data.product_season_id);
        formData.append('description', data.description);
        formData.append('type', data.type);
        formData.append('slug', data.slug);
        formData.append('priority', data.priority);
        formData.append('is_public', data.is_public ? '1' : '0');
        formData.append('study_time', data.study_time);
        formData.append('active', data.active ? '1' : '0');
        if (String(data.type) === '1' && data.file instanceof File) {
          formData.append('file', data.file);
        }
        if (String(data.type) === '2') {
          formData.append('video', data.video);
        }
        if (String(data.type) === '3') {
          formData.append('exam_id', data.exam_id);
        }
        if (String(data.type) === '4') {
          formData.append('exercise_title', data.exercise_title);
          formData.append('exercise_description', data.exercise_description);
          if (String(data.type) === '4' && data.exercise_file instanceof File) {
            formData.append('exercise_file', data.exercise_file);
          }
          formData.append('exercise_count', data.exercise_count);
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
                currentProductsSections
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
    [currentProductsSections, reset, router, t]
  );

  useEffect(() => {
    if (currentProductsSections?.params) {
      if (currentProductsSections.params.file) {
        setPreviewsFile([currentProductsSections.params.file]);
      }
      if (currentProductsSections.params.setPreviewsExerciseFile) {
        setPreviewsExerciseFile([currentProductsSections.params.setPreviewsExerciseFile]);
      }
    }
  }, [currentProductsSections]);
  const itemActive = watch('type');
  const isActive = Boolean(watch('active'));
  const isPublic = Boolean(watch('is_public'));

  return (
    <Form methods={methods} onSubmit={handleSubmit((data) => submitHandler(data))}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          {currentProductsSections && Loading ? (
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
                <Field.Text name="description" label="توضیحات" />
                <Field.Text name="slug" label="اسلاگ" />
                <Field.Text name="priority" label="اولویت" />
                <Field.Text name="study_time" label="تایم مطالعه" />
                <FormControl fullWidth error={!!errors.type}>
                  <InputLabel id="menu-select-label">دسته بندی نوع</InputLabel>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        labelId="menu-select-label"
                        id="menu-select"
                        label="دسته بندی نوع"
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
                <FormControl component="fieldset">
                  <Box sx={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <FormLabel component="legend">آیا عمومی باشد؟</FormLabel>
                      <FormControlLabel
                        control={
                          <Controller
                            name="is_public"
                            control={control}
                            render={({ field }) => (
                              <Switch {...field} checked={Boolean(field.value)} />
                            )}
                          />
                        }
                        label={isPublic ? 'بله' : 'خیر'}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <FormLabel component="legend">آیا فعال باشد؟</FormLabel>
                      <FormControlLabel
                        control={
                          <Controller
                            name="active"
                            control={control}
                            render={({ field }) => (
                              <Switch {...field} checked={Boolean(field.value)} />
                            )}
                          />
                        }
                        label={isActive ? 'بله' : 'خیر'}
                      />
                    </Box>
                  </Box>
                </FormControl>
                {(itemActive === '1' || itemActive === 1) && (
                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2">فایل</Typography>
                    <Controller
                      name="file"
                      control={control}
                      render={({ field }) => (
                        <UploadMultiFile
                          name="file"
                          maxSize={3145728}
                          files={previewsFile}
                          onDrop={handleDropFile}
                          onRemove={() => {
                            setPicsFile([]);
                            setPreviewsFile([]);
                            setValue('file', null);
                          }}
                          onRemoveAll={() => {
                            setPicsFile([]);
                            setPreviewsFile([]);
                            setValue('file', null);
                          }}
                          error={errors.file?.message}
                          {...field}
                        />
                      )}
                    />
                  </Stack>
                )}
                {(itemActive === '2' || itemActive === 2) && (
                  <Field.Text name="video" label="لینک ویدیو" />
                )}
                {(itemActive === '3' || itemActive === 3) && (
                  <FormControl fullWidth error={!!errors.exam_id}>
                    <InputLabel id="menu-select-label">دسته بندی آزمون</InputLabel>
                    <Controller
                      name="exam_id"
                      control={control}
                      render={({ field }) => (
                        <Select
                          labelId="menu-select-label"
                          id="menu-select"
                          label="دسته بندی آزمون"
                          {...field}
                        >
                          {menuExam.map((item) => (
                            <MenuItem key={item.id} value={item.id.toString()}>
                              {item.title}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.exam_id && (
                      <Typography color="error" variant="caption">
                        {errors.exam_id.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
                {(itemActive === '4' || itemActive === 4) && (
                  <>
                    <Field.Text name="exercise_title" label="عنوان تمرین" />
                    <Field.Text name="exercise_description" label="توضیح تمرین" />
                    <Field.Text name="exercise_count" label="تعداد تمرین" />
                    <Stack spacing={1.5}>
                      <Typography variant="subtitle2">فایل تمرین</Typography>
                      <UploadMultiFile
                        name="exercise_file"
                        maxSize={3145728}
                        files={previewsExerciseFile}
                        onDrop={handleDropExerciseFile}
                        onRemove={() => {
                          setPicsExerciseFile([]);
                          setPreviewsExerciseFile([]);
                          setValue('exercise_file', null);
                        }}
                        onRemoveAll={() => {
                          setPicsExerciseFile([]);
                          setPreviewsExerciseFile([]);
                          setValue('exercise_file', null);
                        }}
                        error={errors.exercise_file?.message}
                      />
                    </Stack>
                  </>
                )}
              </Box>
              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  type="button"
                  variant="contained"
                  loading={isSubmitting}
                  onClick={handleSubmit((data) => submitHandler(data, false))}
                >
                  {!currentProductsSections
                    ? t.dashboard.tableCommon.create
                    : t.dashboard.tableCommon.edit}
                </LoadingButton>
                <LoadingButton
                  type="button"
                  variant="contained"
                  loading={isSubmitting}
                  onClick={handleSubmit((data) => submitHandler(data, true))}
                >
                  {!currentProductsSections
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
