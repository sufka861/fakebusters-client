import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GridViewIcon from '@mui/icons-material/GridView';

// third party
import { Formik } from 'formik';
import * as yup from 'yup';

// project import
import MainCard from 'ui-component/cards/MainCard';
import UploadMultiFile from 'ui-component/third-party/dropzone/MultiFile'; // Assuming this is the correct import
import { gridSpacing } from 'store/constant'; // Ensure gridSpacing is correctly imported

const Dropzone = ({ filesRef }) => {
    const [list, setList] = useState(false);
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <MainCard
                    title="Upload CSV Files"
                    secondary={
                        <Stack direction="row" alignItems="center" spacing={1.25}>
                            <IconButton color={list ? 'secondary' : 'primary'} size="small" onClick={() => setList(false)}>
                                <FormatListBulletedIcon style={{ fontSize: '1.15rem' }} />
                            </IconButton>
                            <IconButton color={list ? 'primary' : 'secondary'} size="small" onClick={() => setList(true)}>
                                <GridViewIcon style={{ fontSize: '1.15rem' }} />
                            </IconButton>
                        </Stack>
                    }
                >
                    <Formik
                        initialValues={{ files: null }}
                        onSubmit={(values: any) => {
                        }}
                        validationSchema={yup.object().shape({
                            files: yup.mixed().required('A file is required.') // Changed the message to be more generic
                        })}
                    >
                        {({ values, handleSubmit, setFieldValue, touched, errors }) => (
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Stack spacing={1.5} alignItems="center">
                                            <UploadMultiFile
                                                showList={list}
                                                setFieldValue={setFieldValue}
                                                files={values.files}
                                                error={touched.files && !!errors.files}
                                                filesRef={filesRef}
                                            />
                                        </Stack>
                                        {touched.files && errors.files && (
                                            <FormHelperText error id="standard-weight-helper-text-password-login">
                                                {errors.files}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    </Formik>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default Dropzone;