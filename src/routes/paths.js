// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  dashboard: {
    root: ROOTS.DASHBOARD,
    menu: {
      root: `${ROOTS.DASHBOARD}/menu`,
      new: `${ROOTS.DASHBOARD}/menu/new`,
      list: `${ROOTS.DASHBOARD}/menu/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/menu/${id}/edit`,
    },
    submenu: {
      root: `${ROOTS.DASHBOARD}/submenu`,
      new: `${ROOTS.DASHBOARD}/submenu/new`,
      list: `${ROOTS.DASHBOARD}/submenu/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/submenu/${id}/edit`,
    },
    categories: {
      root: `${ROOTS.DASHBOARD}/categories`,
      new: `${ROOTS.DASHBOARD}/categories/new`,
      list: `${ROOTS.DASHBOARD}/categories/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/categories/${id}/edit`,
    },
    products: {
      root: `${ROOTS.DASHBOARD}/products`,
      new: `${ROOTS.DASHBOARD}/products/new`,
      list: `${ROOTS.DASHBOARD}/products/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/products/${id}/edit`,
    },
    userProducts: {
      root: `${ROOTS.DASHBOARD}/user-products`,
      new: `${ROOTS.DASHBOARD}/user-products/new`,
      list: `${ROOTS.DASHBOARD}/user-products/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/user-products/${id}/edit`,
    },
    productAttribute: {
      root: `${ROOTS.DASHBOARD}/product-attribute`,
      new:(id) =>  `${ROOTS.DASHBOARD}/product-attribute/new/${id}`,
      list: `${ROOTS.DASHBOARD}/product-attribute/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/product-attribute/${id}/edit`,
    },
    userCertificates: {
      root: `${ROOTS.DASHBOARD}/user-certificates`,
      new: `${ROOTS.DASHBOARD}/user-certificates/new`,
      newExcel: `${ROOTS.DASHBOARD}/user-certificates/new/Excel`,
      list: `${ROOTS.DASHBOARD}/user-certificates/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/user-certificates/${id}/edit`,
    },
    professors: {
      root: `${ROOTS.DASHBOARD}/professors`,
      new: (id) => `${ROOTS.DASHBOARD}/professors/new/${id}`,
      list: (id) => `${ROOTS.DASHBOARD}/professors/list/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/professors/${id}/edit`,
    },
    exam: {
      root: `${ROOTS.DASHBOARD}/exam`,
      new: `${ROOTS.DASHBOARD}/exam/new`,
      list: `${ROOTS.DASHBOARD}/exam/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/exam/${id}/edit`,
    },
    examQuestion: {
      root: `${ROOTS.DASHBOARD}/exam-questions`,
      new: (id) => `${ROOTS.DASHBOARD}/exam-questions/new/${id}`,
      list: (id) => `${ROOTS.DASHBOARD}/exam-questions/list/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/exam-questions/${id}/edit`,
    },
    questionOption: {
      root: `${ROOTS.DASHBOARD}/question-options`,
      new: (id) => `${ROOTS.DASHBOARD}/question-options/new/${id}`,
      list: (id) => `${ROOTS.DASHBOARD}/question-options/list/${id}`,
      edit: (id, editId) => `${ROOTS.DASHBOARD}/question-options/${id}/${editId}/edit`,
    },
    productSeasons: {
      root: `${ROOTS.DASHBOARD}/product-seasons`,
      new: `${ROOTS.DASHBOARD}/product-seasons/new`,
      list: `${ROOTS.DASHBOARD}/product-seasons/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/product-seasons/${id}/edit`,
    },
    productSections: {
      root: `${ROOTS.DASHBOARD}/product-sections`,
      new: (session_id, product_id) =>
        `${ROOTS.DASHBOARD}/product-sections/new/${product_id}/${session_id}`,
      list: (session_id, product_id) =>
        `${ROOTS.DASHBOARD}/product-sections/list/${product_id}/${session_id}`,
      edit: (session_id, product_id) =>
        `${ROOTS.DASHBOARD}/product-sections/${session_id}/${product_id}/edit`,
    },
    // group: {
    //   root: `${ROOTS.DASHBOARD}/group`,
    //   five: `${ROOTS.DASHBOARD}/group/five`,
    //   six: `${ROOTS.DASHBOARD}/group/six`,
    // },
  },
};
