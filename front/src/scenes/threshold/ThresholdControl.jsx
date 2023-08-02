
import React, { useState } from 'react';
import { Typography, Slider, Grid, TextField, Button, Box } from '@mui/material';
import Alert from '@mui/material/Alert';
import { dataActions } from '../../store/dataSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
const ThresholdControl = () => {
  const dispatch = useDispatch();
  const [invalidNotification, setInvalidNotification] = useState(false);
  const [invalidNotificationValue, setInvalidNotificationValue] = useState("");
  const [successNotification, setSuccessNotification] = useState(false);
  const [successNotificationValue, setSuccessNotificationValue] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/thresh").then(response => {
      if (!response.ok){
        throw new Error("response not ok");
      }
      return response.json();
    }).then(result => {
      console.log(result.threshold.temperatureMax, result.threshold.temperatureMin)
      setTemperatureThresholdMax(result.threshold.temperatureMax);
      setTemperatureThresholdMin(result.threshold.temperatureMin);
      dispatch(dataActions.replaceThreshold([result.threshold.temperatureMax, result.threshold.temperatureMin]));
    }).catch(err => {
      console.log(err)
    });;
  },[]);
  const [temperatureThresholdMax, setTemperatureThresholdMax] = useState(50);
  const [humidityThresholdMax, setHumidityThresholdMax] = useState(60);
  const [temperatureThresholdMin, setTemperatureThresholdMin] = useState(50);
  const [humidityThresholdMin, setHumidityThresholdMin] = useState(60);


  const handleTemperatureMaxChange = (event, newValue) => {
    setTemperatureThresholdMax(newValue);
  };

  const handleHumidityMaxChange = (event, newValue) => {
    setHumidityThresholdMax(newValue);
  };
  const handleTemperatureMinChange = (event, newValue) => {
    setTemperatureThresholdMin(newValue);
  };

  const handleHumidityMinChange = (event, newValue) => {
    setHumidityThresholdMin(newValue);
  };

  const handleThresholdSubmit = () => {
    if (temperatureThresholdMin >= temperatureThresholdMax){
      setInvalidNotification(true)
      setInvalidNotificationValue("the maximum threshold should be greater than minimum threshold");
      return 
    }
    fetch("http://localhost:8080/threshold-save", {
      method: "POST",
      headers: {
        'Content-Type': "application/json",
      },
      body: JSON.stringify({
          tempMax: temperatureThresholdMax,
          humMax: humidityThresholdMax,
          tempMin: temperatureThresholdMin, 
          humMin: humidityThresholdMin
      })
    }).then(res => {
      if (!res.ok){
          throw new Error("not ok")
      }
      return res.json();
  }).then(result => {
    dispatch(dataActions.replaceThreshold([temperatureThresholdMax, temperatureThresholdMin]));
    setSuccessNotification(true);
    setSuccessNotificationValue("you have successfully changed the threshold");
  }).catch(err => {
      console.log(err)
  })
  };

  return (
    <>{invalidNotification && <Box marginLeft={5} marginRight={10}> <Alert action={
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
   
    <Grid container spacing={2} marginLeft={10} marginTop={10}>
      <Grid item xs={6} md={4}>
        <Typography variant="h6">Temperature Threshold(Max)</Typography>
        <Slider
          value={temperatureThresholdMax}
          onChange={handleTemperatureMaxChange}
          min={0}
          max={100}
          marks
          valueLabelDisplay="auto"
          color="secondary"
         
        />
        <TextField
          label="Threshold Value"
          type="number"
          value={temperatureThresholdMax}
          onChange={(e) => setTemperatureThresholdMax(Number(e.target.value))}
          inputProps={{ min: 0, max: 100 }}
          fullWidth
        />
      </Grid>
      
    </Grid>
    <Grid container spacing={2} marginLeft={10} marginTop={10}>
      <Grid item xs={6} md={4}>
        <Typography variant="h6">Temperature Threshold(Min)</Typography>
        <Slider
          value={temperatureThresholdMin}
          onChange={handleTemperatureMinChange}
          min={0}
          max={100}
          marks
          valueLabelDisplay="auto"
          color="secondary"
        />
        <TextField
          label="Threshold Value"
          type="number"
          value={temperatureThresholdMin}
          onChange={(e) => setTemperatureThresholdMin(Number(e.target.value))}
          inputProps={{ min: 0, max: 100 }}
          fullWidth
        />
      </Grid>
      
      <Grid item xs={12}>
        <Button variant="contained" color="secondary" onClick={handleThresholdSubmit}>
          Save Thresholds
        </Button>
      </Grid>
    </Grid>
    </>
  );
};

export default ThresholdControl;
