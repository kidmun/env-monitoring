import React from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, Link, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Alert from '@mui/material/Alert';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: theme.spacing(4),
  },
  form: {
    maxWidth: 400,
    padding: theme.spacing(2),
    boxShadow: theme.shadows[4],
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
  },
  input: {
    marginBottom: theme.spacing(2),
  },
  submitButton: {
    marginTop: theme.spacing(2),
  },
}));

const LoginPage = () => {
  const [invalidNotification, setInvalidNotification] = useState(false);
  const [invalidNotificationValue, setInvalidNotificationValue] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const classes = useStyles();

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
     fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password
      })
    }).then(response => {
    if (!response.ok){
          throw response
    };
    return response.json();
  }).then(res => {
    const expirationTime = new Date().getTime() + (60 * 60 * 1000);
    localStorage.setItem('token', res.token);
    localStorage.setItem('expirationTime1', expirationTime);
    localStorage.setItem('id', res.userId);
    localStorage.setItem('expirationTime2', expirationTime);
    localStorage.setItem('name', res.name);
    localStorage.setItem('expirationTime3', expirationTime);
    navigate("/");
  }).catch(err => {
    if (err.status !== 401){
      setInvalidNotification(true)
     setInvalidNotificationValue("there is a problem with the server");
    console.log(err.status, err)
    }
    else{
      setInvalidNotification(true)
      setInvalidNotificationValue("There is no user with this email and password");
    }
  }); 
}
}); 
 


  return (<Box>
  {invalidNotification && <Box marginLeft={5} marginRight={10} marginTop={6}> <Alert action={
      <Button color="inherit" size="small">
        X
      </Button>
    } onClick={() => {
    setInvalidNotification(false);
      }} variant="filled" severity="error" wid>
    {invalidNotificationValue}
  </Alert></Box>}  
<Box justifyContent={'center'} marginTop={20}>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <form className={classes.form} onSubmit={formik.handleSubmit}>
            <Typography variant="h5" component="h1" align="center" gutterBottom>
              Login
            </Typography>
            <TextField
              className={classes.input}
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              {...formik.getFieldProps('email')}
              error={formik.touched.email && formik.errors.email}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              className={classes.input}
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              {...formik.getFieldProps('password')}
              error={formik.touched.password && formik.errors.password}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Button
              className={classes.submitButton}
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Sign In
            </Button>
            {/* <Typography variant="body2" align="center" marginTop={2}>
              Already have an account?{' '}
              <Link href="#" underline="none" color="#6be7b1">
                Sign Up
              </Link>
            </Typography> */}
          </form>
        </Grid>
      </Grid>
    </Box>
  </Box>
    
  );
};

export default LoginPage;
