import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, useTheme } from '@mui/material';
import { tokens } from "../theme";
import openSocket from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { dataActions } from '../store/dataSlice';
// Simulated temperature and humidity data
const initialData = {
  temperature: 0,
  humidity: 0,
};

const DataDisplay = () => {
  const dispatch = useDispatch();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
    const [curData, setCurData] = useState({temperature: 0, humidity: 0, analogValue: 0});
    const socket = openSocket("http://localhost:8080");
  socket.on("temp", data => {
    setCurData(data.data)
    dispatch(dataActions.replaceCurData(data.data));
  })
    useEffect(() => {
        fetch("http://localhost:8080/latest").then(res => {
            console.log(res)
            if (!res.ok){
                throw new Error("not ok")
            }
            return res.json();
        }).then(result => {
            console.log(result)
            dispatch(dataActions.replaceCurData(result.data));
            setCurData(result.data)

        }).catch(err => {
            console.log(err)
        })
    }, [])
   
  const [data, setData] = useState(initialData);

  // Simulating data update every second
  

  return (
    <>
    <Grid container spacing={2}>
      <Grid item xs={10} sm={4}>
        <Card sx={{maxHeight: 225,  maxWidth: 250, marginLeft: 10, marginTop: 5, background: colors.primary[400]}}>
        <img
                  alt="profile-user"
                  width="100%"
                  height="70%"
                  src={`../../assets/Temperature-Wallpaper.jpg`}
                  style={{ cursor: "pointer" }}
                />
          <CardContent>
            
            <Typography gutterBottom variant="h5" component="div" color={colors.grey[200]}>
              Temperature
            </Typography>
            <Typography gutterBottom variant="h5" component="div" color={colors.grey[200]}>
              {curData.temperature} degree
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={10} sm={4}>
      <Card sx={{maxHeight: 225,  maxWidth: 250, marginLeft: 10, marginTop: 5, background: colors.primary[400]}}>
        <img
                  alt="profile-user"
                  width="100%"
                  height="60%"
                  src={`../../assets/dddd.jpg`}
                  style={{ cursor: "pointer" }}
                />
          <CardContent>
          
            <Typography gutterBottom variant="h5" component="div" color={colors.grey[200]}>
              Humidity
            </Typography>
            <Typography gutterBottom variant="h5" component="div" color={colors.grey[200]}>
              {curData.humidity}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    <Grid container spacing={2}>
    <Grid item xs={10} sm={4}>
      <Card sx={{maxHeight: 239,  maxWidth: 250, marginLeft: 10, marginTop: 5, background: colors.primary[400]}}>
      <img
                alt="profile-user"
                width="100%"
                height="70%"
                src={`../../assets/jjj.jpg`}
                style={{ cursor: "pointer" }}
              />
        <CardContent>
          
          <Typography gutterBottom variant="h5" component="div" color={colors.grey[200]}>
            Light Intensity
          </Typography>
          <Typography gutterBottom variant="h5" component="div" color={colors.grey[200]}>
            {curData.analogValue} 
          </Typography>
        </CardContent>
      </Card>
    </Grid>
   
  </Grid>
</>  );
};

export default DataDisplay;
