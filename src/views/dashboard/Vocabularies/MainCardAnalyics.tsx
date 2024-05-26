import React, { Ref } from 'react';

// material-ui
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

// project-import
import useConfig from 'hooks/useConfig';

// types
import { ThemeMode } from 'types/config';
import { KeyedObject } from 'types';

// constant
const headerSX = {
    '& .MuiCardHeader-action': { mr: 0 }
};

// ==============================|| CUSTOM MAIN CARD ||============================== //

export interface MainCardProps extends KeyedObject {
    border?: boolean;
    boxShadow?: boolean;
    children: React.ReactNode | string;
    content?: boolean;
    className?: string;
    contentClass?: string;
    contentSX?: CardContentProps['sx'];
    darkTitle?: boolean;
    sx?: CardProps['sx'];
    secondary?: CardHeaderProps['action'];
    shadow?: string;
    elevation?: number;
    title?: React.ReactNode | string;
}

const MainCardAnalyics = React.forwardRef(
    (
        {
            border = false,
            boxShadow,
            children,
            content = true,
            contentClass = '',
            contentSX = {},
            darkTitle,
            secondary,
            shadow,
            sx = {},
            title,
            ...others
        }: MainCardProps,
        ref: Ref<HTMLDivElement>
    ) => {
        const { mode } = useConfig();
        const defaultShadow = mode === ThemeMode.DARK ? '0 2px 14px 0 rgb(33 150 243 / 10%)' : '0 2px 14px 0 rgb(32 40 45 / 8%)';

        return (
            <Card
                ref={ref}
                {...others}
                sx={{
                    border: border ? '1px solid' : 'none',
                    borderColor: 'divider',
                    ':hover': {
                        boxShadow: boxShadow ? shadow || defaultShadow : 'inherit'
                    },
                    ...sx
                }}
            >
                {/* card header and action */}
                {!darkTitle && title && (
                    <CardHeader
                        sx={headerSX}
                        title={<Typography variant="h3" style={{ textAlign: 'center' }}>{title}</Typography>}
                        action={secondary}
                    />
                )}
                {darkTitle && title && (
                    <CardHeader
                        sx={headerSX}
                        title={<Typography variant="h3" style={{ textAlign: 'center', color: 'darkblue' }}>{title}</Typography>}
                        action={secondary}
                    />
                )}

                {/* content & header divider */}
                {title && <Divider />}

                {/* card content */}
                {content && (
                    <CardContent sx={{ ...contentSX, textAlign: 'center' }} className={contentClass}>
                        <Typography variant="body1" style={{ color: 'grey' }}>
                            {children}
                        </Typography>
                    </CardContent>
                )}
                {!content && (
                    <Typography variant="body1" style={{ textAlign: 'center', color: 'grey' }}>
                        {children}
                    </Typography>
                    
                )}
            </Card>
        );
    }
);

export default MainCardAnalyics;
