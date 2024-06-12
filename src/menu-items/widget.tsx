import { FormattedMessage } from 'react-intl';

// assets
import { IconChartArcs, IconClipboardList, IconChartInfographic } from '@tabler/icons-react';

// types
import { NavItemType } from 'types';

const staticMenu: NavItemType = {
    id: 'Other',
    // title: <FormattedMessage id="settings" />,
    type: 'group',
    children: [
        // {
        //     id: 'settings',
        //     title: <FormattedMessage id="settings" />,
        //     type: 'item',
        //     icon: IconChartArcs,
        //     url: '/settings'
        // },  
        {
            id: 'Logout',
            title: <FormattedMessage id="Logout" />,
            type: 'item',
            icon: IconClipboardList,
            url: '/Logout'
        }
    ]
};


export const Menu = () => {
    return staticMenu;
};
