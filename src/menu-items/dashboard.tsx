// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard, IconDeviceAnalytics, IconClipboardList,IconBookOff } from '@tabler/icons-react';

// type
import { NavItemType } from 'types';

const icons = {
    IconDashboard: IconDashboard,
    IconDeviceAnalytics: IconDeviceAnalytics,
    IconClipboardList:IconClipboardList,
    IconBookFilled:IconBookOff
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard: NavItemType = {
    id: 'dashboard',
    // title: <FormattedMessage id="dashboard" />,
    icon: icons.IconDashboard,
    type: 'group',
    children: [
        {
            id: 'default',
            title: <FormattedMessage id="Home" />,
            type: 'item',
            url: '/dashboard/default',
            icon: icons.IconDashboard,
            breadcrumbs: false
        },
        {
            id: 'newAnalysis',
            title: <FormattedMessage id="New Analysis" />,
            type: 'item',
            url: '/dashboard/analytics',
            icon: icons.IconDeviceAnalytics,
            breadcrumbs: true
        },
        {
            id: 'results',
            title: <FormattedMessage id="Results" />,
            type: 'item',
            url: '/dashboard/results',
            icon: icons.IconClipboardList,
            breadcrumbs: true
        },
        {
            id: 'vocabularies',
            title: <FormattedMessage id="Stop-Words" />,
            type: 'item',
            url: '/dashboard/vocabularies',
            icon: icons.IconBookFilled,
            breadcrumbs: true
        },
    ]
};

export default dashboard;
