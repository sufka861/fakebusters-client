// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard, IconDeviceAnalytics, IconClipboardList,IconBookOff,IconGraph } from '@tabler/icons-react';

// type
import { NavItemType } from 'types';

const icons = {
    IconDashboard: IconDashboard,
    IconDeviceAnalytics: IconDeviceAnalytics,
    IconClipboardList:IconClipboardList,
    IconBookFilled:IconBookOff,
    IconGraph:IconGraph
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
            breadcrumbs: false
        },
        {
            id: 'results',
            title: <FormattedMessage id="Results" />,
            type: 'item',
            url: '/dashboard/results',
            icon: icons.IconClipboardList,
            breadcrumbs: false
        },
        {
            id: 'structure',
            title: <FormattedMessage id="Network Analysis" />,
            type: 'item',
            url: '/dashboard/structure',
            icon: icons.IconGraph,
            breadcrumbs: false
        },
        {
            id: 'vocabularies',
            title: <FormattedMessage id="Stop-Words" />,
            type: 'item',
            url: '/dashboard/vocabularies',
            icon: icons.IconBookFilled,
            breadcrumbs: false
        }
    ]
};

export default dashboard;
