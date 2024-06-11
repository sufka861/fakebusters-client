import { useState } from 'react';
import Grid from '@mui/material/Grid';
import { Formik } from 'formik';
import * as yup from 'yup';
import MainCard from 'ui-component/cards/MainCard';
import UploadSingleFile from 'ui-component/third-party/dropzone/SingleFile';
import { gridSpacing } from 'store/constant';
import SingleFileUpload from 'ui-component/third-party/dropzone/SingleFile';

// dropzone.tsx

// ... (imports)

const Dropzone = ({ fileRef }) => {
    const [list, setList] = useState(false);

    return (
        <Grid item xs={12}>
            <MainCard title="Upload CSV File">
                <Formik
                    initialValues={{ files: null }}
                    onSubmit={(values: any) => {
                        // submit form
                    }}
                    validationSchema={yup.object().shape({
                        files: yup.mixed().required('File is required.')
                    })}
                >
                    {({ values, handleSubmit, setFieldValue, touched, errors }) => (
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <SingleFileUpload
                                        setFieldValue={setFieldValue}
                                        file={values.files}
                                        error={touched.files && !!errors.files}
                                        fileRef={fileRef} // Pass fileRef
                                    />
                                    {touched.files && errors.files && (
                                        <div style={{ color: 'red' }}>
                                            {errors.files as string}
                                        </div>
                                    )}
                                </Grid>
                            </Grid>
                        </form>
                    )}
                </Formik>
            </MainCard>
        </Grid>
    );
};

export default Dropzone;
