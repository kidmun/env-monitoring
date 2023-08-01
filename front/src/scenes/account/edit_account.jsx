import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import Alert from '@mui/material/Alert';
import { dataActions } from "../../store/dataSlice";
import { useState } from "react";

const EditAccount = () => {
    
    const curUser = useSelector((state) => state.data.curUser);
    const initialValues = {
        firstName: curUser.firstName,
        lastName: curUser.lastName,
        email: curUser.email,
        contact: curUser.phoneNumber,
        address1: curUser.address,
      
      };
    
  const [successNotification, setSuccessNotification] = useState(false);
  const [successNotificationValue, setSuccessNotificationValue] = useState("");
  const [invalidNotification, setInvalidNotification] = useState(false);
  const [invalidNotificationValue, setInvalidNotificationValue] = useState("");
  const dispatch = useDispatch();
  const isNonMobile = useMediaQuery("(min-width:600px)");
console.log("ee")
  const handleFormSubmit = (values) => {
    console.log("ggg")
    console.log(values)
   fetch("http://localhost:8080/edit-account/" + curUser._id.toString(), {
    method: "PUT", 
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      address: values.address1,
      phoneNumber: values.contact
    })
   }).then(response => {
    if (!response.ok){
      throw response
    }
    return response.json();
   }).then(res => {
   dispatch(dataActions.setUser(res.user))
   setSuccessNotification(true)
   setSuccessNotificationValue("you have successfully edited your account");
   }).catch(err => {
    if (err.status !== 422){
      setInvalidNotification(true)
     setInvalidNotificationValue("there is a problem with the server");
    console.log(err.status, err)
    }
    else{
      setInvalidNotification(true)
      setInvalidNotificationValue("there is a user with this email");
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
      <Header title="EDIT ACCOUNT"/>
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
                type="text"
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={!!touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Contact Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact}
                name="contact"
                error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address1}
                name="address1"
                error={!!touched.address1 && !!errors.address1}
                helperText={touched.address1 && errors.address1}
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
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  contact: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required").min(10, '10 digits are allowed').max(10, '10 digits are allowed'),
  address1: yup.string().required("required"),
 
});


export default EditAccount;
