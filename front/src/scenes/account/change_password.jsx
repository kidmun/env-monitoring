import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import Alert from '@mui/material/Alert';
import { dataActions } from "../../store/dataSlice";
import { useState } from "react";

const ChangePassword = () => {
    
    const curUser = useSelector((state) => state.data.curUser);
    const initialValues = {
        oldPassword: "",
        password: "",
        confirmPassword: ""
      };
    
  const [successNotification, setSuccessNotification] = useState(false);
  const [successNotificationValue, setSuccessNotificationValue] = useState("");
  const [invalidNotification, setInvalidNotification] = useState(false);
  const [invalidNotificationValue, setInvalidNotificationValue] = useState("");
  const dispatch = useDispatch();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values) => {
     console.log(values)
     fetch("http://localhost:8080/change-password/" + curUser._id.toString(), {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: curUser.email,
       oldPassword: values.oldPassword,
       newPassword: values.password
      })
     }).then(response => {
      console.log(response)
      if (!response.ok){
        throw response
      }
      return response.json();
     }).then(res => {
     dispatch(dataActions.setUser(res.user))
     setSuccessNotification(true)
     setSuccessNotificationValue("you have successfully changed your password");
     }).catch(err => {
      console.log(err)
      if (err.status !== 401){
        setInvalidNotification(true)
       setInvalidNotificationValue("there is a problem with the server");
      console.log(err.status, err)
      }
      else{
        setInvalidNotification(true)
        setInvalidNotificationValue("Wrong Old Password");
      }
     })
  
  };

  return (<>
  {invalidNotification && <Box marginLeft={5} marginRight={10}> <Alert action={
      <Button color="inherit" size="small">
        X
      </Button>
    } onClick={() => {
    setInvalidNotification(false);
      }} variant="filled" severity="error" wid>
    {invalidNotificationValue}
  </Alert></Box>}
  {successNotification && <Box marginLeft={5} marginRight={10}> <Alert action={
      <Button color="inherit" size="small">
        X
      </Button>
    } onClick={() => {
    setSuccessNotification(false);
      }} variant="filled" severity="success" wid>
    {successNotificationValue}
  </Alert></Box>}
  <Box m="20px" width="60%" marginLeft={5} marginBottom={10} marginTop={0}>
      <Header title="Change Password"/>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              marginTop={0}
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
                 <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Old Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.oldPassword}
                name="oldPassword"
                error={!!touched.oldPassword && !!errors.oldPassword}
                helperText={touched.oldPassword && errors.oldPassword}
                sx={{ gridColumn: "span 4" }}
              />
               <TextField
                fullWidth
                variant="filled"
                type="password"
                label="New Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Confirm Pasword"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.confirmPassword}
                name="confirmPassword"
                error={!!touched.confirmPassword && !!errors.confirmPassword}
                helperText={touched.confirmPassword && errors.confirmPassword}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px" >
              <Button type="submit" color="secondary" variant="contained">
                Submit
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  </>
    
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
oldPassword: yup.string().required("required"),
  password: yup.string().required("required").min(5, 'Password too short'),
  confirmPassword: yup
  .string()
  .required()
  .oneOf([yup.ref("password"), null], "Passwords must match")
});


export default ChangePassword;
