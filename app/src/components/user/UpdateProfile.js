import {Box, Button, Card, CardContent, CardHeader, Divider, Grid, TextField} from "@material-ui/core";
import React from "react";
import {gql, useMutation} from '@apollo/client';
import {useFormik} from "formik";
import Alert from "@material-ui/lab/Alert/Alert";

const validate = values => {
    const errors = {};

    if (values.name.length > 15) {
        errors.name = 'Must be 15 characters or less';
    }

    if (values.lastName.length > 20) {
        errors.lastName = 'Must be 20 characters or less';
    }

    return errors;
};
const UPDATE_USER = gql`
mutation updateUser(
  $userId: ID!
  $name: String
  $lastName: String
  $number: Int
){
  modifyUser(
    userId: $userId,
    lastName: $lastName,
    number: $number,
    name: $name){
    profile{
      name
      lastName
      number
    }
  }
}
`;

export default function UpdateProfile(props) {
    const {user} = props;
    const [updateUser] = useMutation(UPDATE_USER);
    const [invalidAuth, setInvalidAuth] = React.useState(false);

    const update = async (values) => {
        try {
            await updateUser({
                variables: {
                    userId: user.id,
                    name: values.name,
                    lastName: values.lastName,
                    number: values.number
                }
            })
        }catch (e) {
            setInvalidAuth(true);
        }
    };
    const formik = useFormik({
        initialValues: {
            number: parseInt(user.profile.number),
            name: user.profile.name,
            lastName: user.profile.lastName,
        },
        validate,
        onSubmit: async values => update(values),
    });

    return (
        <Grid
            item
            lg={8}
            md={6}
            xs={12}
        >
            {invalidAuth &&
            <Alert  severity="error">Something has gone wrong try again</Alert>
            }

            <form onSubmit={formik.handleSubmit}>
                <Card>
                    <CardHeader
                        subheader="The information can be edited"
                        title="Profile"
                    />
                    <Divider/>

                    <CardContent>
                        <Grid
                            container
                            spacing={3}
                        >
                            <Grid
                                item
                                md={6}
                                xs={12}
                            >
                                <TextField
                                    fullWidth
                                    helperText="Please specify the first name"
                                    label="First name"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.name}
                                    variant="outlined"
                                />
                                {formik.touched.name && formik.errors.name ? (
                                    <Alert severity="error">{formik.errors.name}</Alert>
                                ) : null}
                            </Grid>
                            <Grid
                                item
                                md={6}
                                xs={12}
                            >
                                <TextField
                                    fullWidth
                                    label="Last name"
                                    name="lastName"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.lastName}
                                    variant="outlined"
                                />
                                {formik.touched.lastName && formik.errors.lastName ? (
                                    <Alert severity="error">{formik.errors.lastName}</Alert>
                                ) : null}
                            </Grid>
                            <Grid
                                item
                                md={6}
                                xs={12}
                            >
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    name="number"
                                    onChange={formik.handleChange}
                                    value={formik.values.number} type="number"
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                    <Divider/>
                    <Box
                        display="flex"
                        justifyContent="flex-end"
                        p={2}
                    >
                        <Button
                            color="primary"
                            variant="contained"
                            type="submit"
                        >
                            Save details
                        </Button>
                    </Box>
                </Card>
            </form>
        </Grid>
    );
}