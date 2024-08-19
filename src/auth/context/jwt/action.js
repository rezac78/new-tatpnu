import { toast } from 'sonner';

import axios from 'src/utils/axios';

import { AUTH_API } from 'src/config-global';

import { setSession } from './utils';
// import { STORAGE_KEY } from './constant';

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ phone_number, password, Loading }) => {
  try {
    const params = new FormData();
    params.append('phone_number', phone_number);
    params.append('password', password);
    const res = await axios.post(`${AUTH_API}v1/account/login`, params);
    const { token } = res.data.data;

    if (!token) {
      throw new Error('Access token not found in response');
    }
    setSession(token);
    toast.success('ورود موفقیت آمیز بود');
  } catch (error) {
    console.error('Error during sign in:', error);
    Loading(false);
    toast.error(`${error.response.data.message ? error.response.data.message : 'مشکلی پیش امده'}`);
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
// export const signUp = async ({ email, password, firstName, lastName }) => {
//   const params = {
//     email,
//     password,
//     firstName,
//     lastName,
//   };
//
//   try {
//     const res = await axios.post(`${AUTH_API}v1/account/check`, params);
//     console.log(res);
//     const { accessToken } = res.data;
//
//     if (!accessToken) {
//       throw new Error('Access token not found in response');
//     }
//
//     sessionStorage.setItem(STORAGE_KEY, accessToken);
//   } catch (error) {
//     console.error('Error during sign up:', error);
//     throw error;
//   }
// };

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async () => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
