import { useMemo, useEffect, useCallback } from 'react';

import { useSetState } from 'src/hooks/use-set-state';

import axios from 'src/utils/axios';

import { HOST_API, AUTH_API_KEY } from 'src/config-global';

import { setSession } from './utils';
import { STORAGE_KEY } from './constant';
import { AuthContext } from '../auth-context';

// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  const { state, setState } = useSetState({
    user: null,
    loading: true,
  });

  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);
      if (accessToken) {
        await setSession(accessToken);

        await axios
          .get(`${HOST_API}users/dashboard/app`, {
            headers: {
              'Api-Key': AUTH_API_KEY,
            },
          })
          .then(({ data }) => {
            const { status } = data;
            if (status) {
              const { user } = data.data;
              // enqueueSnackbar(message, {variant: 'success'})
              setState({ user: { ...user, accessToken }, loading: false });
            } else {
              setState({ user: null, loading: false });
            }
          });

        // const { user } = res.data;
        //
        // setState({ user: { ...user, accessToken }, loading: false });
      } else {
        setState({ user: null, loading: false });
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';
  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            role: state.user?.role ?? 'admin',
          }
        : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
