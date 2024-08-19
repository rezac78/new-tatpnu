import { paths } from 'src/routes/paths';

import fa from 'src/locales/fa';
import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  menu: icon('ic-menu'),
  categories: icon('ic-categories'),
  product: icon('ic-product'),
  exam: icon('ic-exam'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------
const t = fa;

export const navData = [
  /**
   * Overview
   */
  {
    subheader: 'داشبورد LMS',
    items: [
      { title: 'داشبورد', path: paths.dashboard.root, icon: ICONS.dashboard },
      {
        title: t.dashboard.pages.menu,
        path: paths.dashboard.menu.list,
        icon: ICONS.menu,
        children: [
          {
            title: t.dashboard.pages.menu,
            path: paths.dashboard.menu.list,
          },
          {
            title: t.dashboard.pages.submenu,
            path: paths.dashboard.submenu.list,
          },
        ],
      },
      {
        title: t.dashboard.pages.products,
        path: paths.dashboard.products.list,
        icon: ICONS.product,
        children: [
          {
            title: t.dashboard.pages.categories,
            path: paths.dashboard.categories.list,
          },
          {
            title: t.dashboard.pages.products,
            path: paths.dashboard.products.list,
            // icon: ICONS.user,
          },
          {
            title: t.dashboard.pages.userProducts,
            path: paths.dashboard.userProducts.list,
            // icon: ICONS.user,
          },
          // {
          //   title: t.dashboard.pages.productAttribute,
          //   path: paths.dashboard.productAttribute.list,
          //   // icon: ICONS.user,
          // },
          {
            title: t.dashboard.pages.userCertificates,
            path: paths.dashboard.userCertificates.list,
            // icon: ICONS.user,
          },
        ],
      },
      {
        title: t.dashboard.pages.exam,
        path: paths.dashboard.exam.list,
        icon: ICONS.exam,
      },
    ],
  },
  /**
   * Management
   */
  // {
  //   subheader: 'Management',
  //   items: [
  //     {
  //       title: 'Group',
  //       path: paths.dashboard.group.root,
  //       icon: ICONS.user,
  //       children: [
  //         { title: 'Four', path: paths.dashboard.group.root },
  //         { title: 'Five', path: paths.dashboard.group.five },
  //         { title: 'Six', path: paths.dashboard.group.six },
  //       ],
  //     },
  //   ],
  // },
];
