import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';

interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

const BootstrapDialogTitle = ({ children, onClose, ...other }: DialogTitleProps) => (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 10,
                    top: 10,
                    color: (theme) => theme.palette.grey[500]
                }}
            >
                <CloseIcon />
            </IconButton>
        ) : null}
    </DialogTitle>
);

interface CustomizedDialogsProps {
    open: boolean;
    onClose: () => void;
}

export default function CustomizedDialogs({ open, onClose }: CustomizedDialogsProps) {
    return (
        <Dialog onClose={onClose} aria-labelledby="customized-dialog-title" open={open}>
            <BootstrapDialogTitle id="customized-dialog-title" onClose={onClose}>
                Analysis in Progress
            </BootstrapDialogTitle>
            <DialogContent dividers sx={{ p: 3, bgcolor: '#f5f5f5' }}>
                <Typography gutterBottom variant="body1" component="p" sx={{ mb: 2 }}>
                The process of analyzing the text using a Latent Personal Analysis Algorithm (LPA) can take time, depending on the complexity and size of the data submitted. We appreciate your patience while the analysis is underway.
                </Typography>
                <Typography gutterBottom variant="body1" component="p" sx={{ mb: 2 }}>
                    In the meantime, we will display some initial data about the uploaded file. Once the analysis is complete, you will be automatically redirected to the results page to explore the insights derived from the LPA algorithm.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button variant="contained" color="primary" onClick={onClose} autoFocus>
                    Understand
                </Button>
            </DialogActions>
        </Dialog>
    );
}
