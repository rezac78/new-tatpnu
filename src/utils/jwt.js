import { jwtDecode } from 'jwt-decode';

//
import axios from './axios';

// ----------------------------------------------------------------------
// const isValidToken1 = (accessToken)=>{

//   if (!accessToken) {
//     return false;
//   }
// // Decode the token's payload
//   const decodedToken = jwt.decode(accessToken);

// // Extract the expiration date from the decoded token payload
//   const expirationDate = new Date(decodedToken.exp * 1000); // Multiply by 1000 to convert seconds to milliseconds
//   const currentTime = Date.now() / 1000;

// // Print the expiration date
//   console.log('Expiration date:', expirationDate);
//   return expirationDate > currentTime;

// }

const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }
  // const token = accessToken.replace("Bearer ", "");
  // ----------------------------------------------------------------------

  const decoded = jwtDecode(accessToken.replace('Bearer ', ''));
  const currentTime = Date.now() / 1000;

  // console.log('decoded',decoded)
  // console.log('currentTime',currentTime)

  return decoded.exp > currentTime;
};

//  const handleTokenExpired = (exp) => {
//   let expiredTimer;

//   window.clearTimeout(expiredTimer);
//   const currentTime = Date.now();
//   const timeLeft = exp * 1000 - currentTime;
//   console.log(timeLeft);
//   expiredTimer = window.setTimeout(() => {
//     console.log('expired');
//     // You can do what ever you want here, like show a notification
//   }, timeLeft);
// };

// ----------------------------------------------------------------------

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common.Authorization = `${accessToken}`;
    // This function below will handle when token is expired
    // const { exp } = jwtDecode(accessToken);
    // handleTokenExpired(exp);
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

export { isValidToken };
