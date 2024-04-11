import React from 'react';
import { useTheme } from '@mui/material/styles';

import logoDark from 'assets/images/logo-dark.svg';
import logo from 'assets/images/logo.svg';

import { ThemeMode } from 'types/config';

const Logo = () => {
    const theme = useTheme();

    return (

        <img src={theme.palette.mode === ThemeMode.DARK ? logoDark : logo} alt="Logo" width="90%" />
    );
};

export default Logo;
