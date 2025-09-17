/* eslint-disable prettier/prettier */
import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cilDescription,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilUser,
  cilDrop,
  cilPencil,
  cilCursor,
  cilNotes,
  cilChartPie,
  cilBell,
  cilCalculator,
  cilExternalLink,
  cilDataTransferDown,
} from "@coreui/icons"

import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react"

// Helper to get scopes from JWT in localStorage
function getScopesFromLocalStorage() {
  const token = localStorage.getItem('token');
  if (!token) return [];
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.scope) return payload.scope.split(' ');
    if (payload.scopes) return payload.scopes;
    return [];
  } catch {
    return [];
  }
}

const scopes = getScopesFromLocalStorage();

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Configuration'
  },
  {
    component: CNavTitle,
    name: 'Theme',
  },
  {
    component: CNavItem,
    name: 'Colors',
    to: '/theme/colors',
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Typography',
    to: '/theme/typography',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Components',
  },
    {
      component: CNavGroup,
      name: 'Admin',
      to: '/base',
      icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Accordion',
          to: '/base/accordion',
        },
        {
          component: CNavItem,
          name: 'Breadcrumb',
          to: '/base/breadcrumbs',
        },
        {
          component: CNavItem,
          name: (
            <React.Fragment>
              {'Calendar'}
              <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
            </React.Fragment>
          ),
          href: 'https://coreui.io/react/docs/components/calendar/',
          badge: {
            color: 'danger',
            text: 'PRO',
          },
        },
        {
          component: CNavItem,
          name: 'Cards',
          to: '/base/cards',
        },
        {
          component: CNavItem,
          name: 'Carousel',
          to: '/base/carousels',
        },
        {
          component: CNavItem,
          name: 'Collapse',
          to: '/base/collapses',
        },
        {
          component: CNavItem,
          name: 'List group',
          to: '/base/list-groups',
        },
        {
          component: CNavItem,
          name: 'Navs & Tabs',
          to: '/base/navs',
        },
        {
          component: CNavItem,
          name: 'Pagination',
          to: '/base/paginations',
        },
        {
          component: CNavItem,
          name: 'Placeholders',
          to: '/base/placeholders',
        },
        {
          component: CNavItem,
          name: 'Popovers',
          to: '/base/popovers',
        },
        {
          component: CNavItem,
          name: 'Progress',
          to: '/base/progress',
        },
        {
          component: CNavItem,
          name: 'Smart Pagination',
          href: 'https://coreui.io/react/docs/components/smart-pagination/',
          badge: {
            color: 'danger',
            text: 'PRO',
          },
        },
        {
          component: CNavItem,
          name: (
            <React.Fragment>
              {'Smart Table'}
              <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
            </React.Fragment>
          ),
          href: 'https://coreui.io/react/docs/components/smart-table/',
          badge: {
            color: 'danger',
            text: 'PRO',
          },
        },
        {
          component: CNavItem,
          name: 'Spinners',
          to: '/base/spinners',
        },
        {
          component: CNavItem,
          name: 'Tables',
          to: '/base/tables',
        },
        {
          component: CNavItem,
          name: 'Tabs',
          to: '/base/tabs',
        },
        {
          component: CNavItem,
          name: 'Tooltips',
          to: '/base/tooltips',
        },
        {
          component: CNavItem,
          name: (
            <React.Fragment>
              {'Virtual Scroller'}
              <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
            </React.Fragment>
          ),
          href: 'https://coreui.io/react/docs/components/virtual-scroller/',
          badge: {
            color: 'danger',
            text: 'PRO',
          },
        },
        {
          component: CNavItem,
          name: 'Jobs',
          to: '/admin/jobs',
          icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
        },
        {
          component: CNavItem,
          name: 'Sources',
          to: '/admin/sources',
          icon: <CIcon icon={cilDataTransferDown} customClassName="nav-icon" />,
        },
        {
          component: CNavItem,
          name: 'Users',
          to: '/users',
          icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
        },
      ],
    },
  {
    component: CNavGroup,
    name: 'Buttons',
    to: '/buttons',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Buttons',
        to: '/buttons/buttons',
      },
      {
        component: CNavItem,
        name: 'Buttons groups',
        to: '/buttons/button-groups',
      },
      {
        component: CNavItem,
        name: 'Dropdowns',
        to: '/buttons/dropdowns',
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Loading Button'}
            <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
          </React.Fragment>
        ),
        href: 'https://coreui.io/react/docs/components/loading-button/',
        badge: {
          color: 'danger',
          text: 'PRO',
        },
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Forms',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Form Control',
        to: '/forms/form-control',
      },
      {
        component: CNavItem,
        name: 'Select',
        to: '/forms/select',
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Multi Select'}
            <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
          </React.Fragment>
        ),
        href: 'https://coreui.io/react/docs/forms/multi-select/',
        badge: {
          color: 'danger',
          text: 'PRO',
        },
      },
      {
        component: CNavItem,
        name: 'Checks & Radios',
        to: '/forms/checks-radios',
      },
      {
        component: CNavItem,
        name: 'Range',
        to: '/forms/range',
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Range Slider'}
            <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
          </React.Fragment>
        ),
        href: 'https://coreui.io/react/docs/forms/range-slider/',
        badge: {
          color: 'danger',
          text: 'PRO',
        },
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Rating'}
            <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
          </React.Fragment>
        ),
        href: 'https://coreui.io/react/docs/forms/rating/',
        badge: {
          color: 'danger',
          text: 'PRO',
        },
      },
      {
        component: CNavItem,
        name: 'Input Group',
        to: '/forms/input-group',
      },
      {
        component: CNavItem,
        name: 'Floating Labels',
        to: '/forms/floating-labels',
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Date Picker'}
            <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
          </React.Fragment>
        ),
        href: 'https://coreui.io/react/docs/forms/date-picker/',
        badge: {
          color: 'danger',
          text: 'PRO',
        },
      },
      {
        component: CNavItem,
        name: 'Date Range Picker',
        href: 'https://coreui.io/react/docs/forms/date-range-picker/',
        badge: {
          color: 'danger',
          text: 'PRO',
        },
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Time Picker'}
            <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
          </React.Fragment>
        ),
        href: 'https://coreui.io/react/docs/forms/time-picker/',
        badge: {
          color: 'danger',
          text: 'PRO',
        },
      },
      {
        component: CNavItem,
        name: 'Layout',
        to: '/forms/layout',
      },
      {
        component: CNavItem,
        name: 'Validation',
        to: '/forms/validation',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Charts',
    to: '/charts',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Icons',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'CoreUI Free',
        to: '/icons/coreui-icons',
      },
      {
        component: CNavItem,
        name: 'CoreUI Flags',
        to: '/icons/flags',
      },
      {
        component: CNavItem,
        name: 'CoreUI Brands',
        to: '/icons/brands',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Notifications',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Alerts',
        to: '/notifications/alerts',
      },
      {
        component: CNavItem,
        name: 'Badges',
        to: '/notifications/badges',
      },
      {
        component: CNavItem,
        name: 'Modal',
        to: '/notifications/modals',
      },
      {
        component: CNavItem,
        name: 'Toasts',
        to: '/notifications/toasts',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Widgets',
    to: '/widgets',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Extras',
  }, 
  {
    component: CNavGroup,
    name: '<dev/>',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'API Spec',
        href: 'https://coreui.io/react/docs/templates/installation/',
        icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
      }
    ],
  },
]

export default _nav
