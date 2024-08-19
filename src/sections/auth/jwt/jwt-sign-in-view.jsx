import axios from 'axios';
import { toast } from 'sonner';
import { useRef, useState } from 'react';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { PhoneValidation } from 'src/utils/PhoneValidation';

import fa from 'src/locales/fa';
import { AUTH_API, AUTH_API_KEY } from 'src/config-global';

import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';
import { signInWithPassword } from 'src/auth/context/jwt';

export function JwtSignInView() {
  const t = fa;

  const { checkUserSession } = useAuthContext();

  const renderHead = (
    <Stack spacing={1.5} sx={{ mb: 5 }}>
      <Typography variant="h5">{t.auth.Sign}</Typography>
    </Stack>
  );
  const passRef = useRef();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({
    phone_number: false,
    password: false,
  });
  const [infos, setInfos] = useState({
    phone_number: '',
    password: '',
    name: '',
    code: '',
    existCode: '',
    resetCode: '',
    newPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const setInfoValueFunc = (name, e) => {
    const value = e.target ? e.target.value : e;
    setInfos((prevState) => ({ ...prevState, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const infosFormData = new FormData();

    if (step === 0) {
      if (!PhoneValidation(infos.phone_number))
        setErrors((prevState) => ({ ...prevState, phone_number: true }));
      else {
        infosFormData.append('phone_number', infos.phone_number);
        // sending phone_number for checking the user status
        await axios
          .post(`${AUTH_API}v1/account/check`, infosFormData, {
            headers: {
              'Api-Key': AUTH_API_KEY,
            },
          })
          .then(({ data }) => {
            const check = data.data;
            if (check?.is_created === true) {
              // receiving the password from the user
              passRef.current.focus();
              setStep(1);
            } else {
              toast.error('حساب کاربری با این شماره وجود ندارد!');
              // enqueueSnackbar('حساب کاربری با این شماره وجود ندارد!');
            }
          });
        // .catch((e) => {
        //   console.error(e);
        //   // enqueueSnackbar(e.response.data.message, {variant: "error"})
        // });
      }
    } else if (step === 1) {
      if (!infos.password) setErrors((prevState) => ({ ...prevState, password: true }));
      else {
        infosFormData.append('phone_number', infos.phone_number);
        infosFormData.append('password', infos.password);

        await signInWithPassword({
          phone_number: infos.phone_number,
          password: infos.password,
          Loading: setIsSubmitting,
        });
        await checkUserSession?.();
      }
    }
    setIsSubmitting(false);
  };

  const renderForm = (
    <form onSubmit={onSubmit}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <div className="w-full h-[56px] relative mb-6">
          <TextField
            fullWidth
            className={`${step === 0 ? '' : 'hidden'} `}
            name="email"
            type="number"
            autoFocus={step === 0}
            label="شماره تلفن"
            value={infos.phone_number}
            onChange={(e) => setInfoValueFunc('phone_number', e)}
            error={errors.phone_number}
            helperText={errors.phone_number && 'شماره ی وارد شده اشتباه است'}
          />

          <TextField
            fullWidth
            inputRef={passRef}
            className={`${step === 1 ? '' : 'hidden'} `}
            name="password"
            label="رمز عبور"
            type={showPassword ? 'text' : 'password'}
            value={infos.password}
            onChange={(e) => setInfoValueFunc('password', e)}
            error={errors.password}
            helperText={errors.password && 'رمز عبور وارد شده اشتباه است'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        ورود
      </LoadingButton>
    </form>
    // <Stack spacing={3}>
    //   <Field.Text name="phone_number" label={t.auth.phone} InputLabelProps={{ shrink: true }} />
    //   <Stack spacing={1.5}>
    //     <Field.Text
    //       name="password"
    //       label={t.auth.password}
    //       placeholder="6+ characters"
    //       type={password.value ? 'text' : 'password'}
    //       InputLabelProps={{ shrink: true }}
    //       InputProps={{
    //         endAdornment: (
    //           <InputAdornment position="end">
    //             <IconButton onClick={password.onToggle} edge="end">
    //               <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
    //             </IconButton>
    //           </InputAdornment>
    //         ),
    //       }}
    //     />
    //   </Stack>

    //   <LoadingButton
    //     fullWidth
    //     color="inherit"
    //     size="large"
    //     type="submit"
    //     variant="contained"
    //     loading={isSubmitting}
    //     loadingIndicator="Sign in..."
    //   >
    //     {t.auth.SignIn}
    //   </LoadingButton>
    // </Stack>
  );

  return (
    <>
      {renderHead}

      {/* <Alert severity="info" sx={{ mb: 3 }}>
        Use <strong>{defaultValues.phone}</strong>
        {' with password '}
        <strong>{defaultValues.password}</strong>
      </Alert> */}

      {/* {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )} */}

      {/* <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form> */}
      {renderForm}
    </>
  );
}
