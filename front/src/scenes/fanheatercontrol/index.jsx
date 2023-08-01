import { Box, Typography, useTheme, Button, Card, CardContent } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useDispatch, useSelector } from "react-redux";
import { mockDataInvoices } from "../../data/mockData";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { dataActions } from "../../store/dataSlice";

const FanHeater = () => {
  const dispatch = useDispatch();
  
  const cur_data = useSelector((state) => state.data.cur_data);
  const thresh = useSelector((state) => state.data.threshold);
  const [fanButton, setFanButton] = useState("Start");
  const [heaterButton, setHeatorButton] = useState("Start");
  useEffect(() => {
    if (Number(cur_data.temperature) > Number(thresh[0])){
      console.log(Number(cur_data.temperature) > Number(thresh[0]))
      setFanButton("Stop");
      setHeatorButton("Start");
    }
    else if (Number(cur_data.temperature) < Number(thresh[1])){
      setFanButton("Start");
      setHeatorButton("Stop");
    }
    
  }, [cur_data, thresh]);
  const fanButtonHandler = () => {
    console.log("workddd")
    if (fanButton === "Start"){
      console.log("work")
      fetch("http://localhost:8080/threshold-save", {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify({
            tempMax: 0,
            humMax: 0,
            tempMin: 0, 
            humMin: 0
        })
      }).then(res => {
        if (!res.ok){
            throw new Error("not ok")
        }
        return res.json();
    }).then(result => {
      dispatch(dataActions.replaceThreshold([0, 0]));
    
    }).catch(err => {
        console.log(err)
    })
    setFanButton("Stop");
    setHeatorButton("Start");
    }
    else{
      fetch("http://localhost:8080/threshold-save", {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify({
            tempMax: Number(cur_data.temperature) + 5,
            humMax: 0,
            tempMin:  Number(cur_data.temperature) - 5, 
            humMin: 0
        })
      }).then(res => {
        if (!res.ok){
            throw new Error("not ok")
        }
        return res.json();
    }).then(result => {
      dispatch(dataActions.replaceThreshold([Number(cur_data.temperature) + 5, Number(cur_data.temperature) - 5]));
    
    }).catch(err => {
        console.log(err)
    })
    setFanButton("Start");
    }
   
  };
  const heatorButtonHandler = () => {
    
    if (heaterButton === "Start"){
      fetch("http://localhost:8080/threshold-save", {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify({
            tempMax: 100,
            humMax: 0,
            tempMin: 100, 
            humMin: 0
        })
      }).then(res => {
        if (!res.ok){
            throw new Error("not ok")
        }
        return res.json();
    }).then(result => {
      dispatch(dataActions.replaceThreshold([100, 100]));
    
    }).catch(err => {
        console.log(err)
    })
    setFanButton("Start");
    setHeatorButton("Stop");
    }
    else{
      fetch("http://localhost:8080/threshold-save", {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify({
            tempMax: Number(cur_data.temperature) + 5,
            humMax: 0,
            tempMin:  Number(cur_data.temperature) - 5, 
            humMin: 0
        })
      }).then(res => {
        if (!res.ok){
            throw new Error("not ok")
        }
        return res.json();
    }).then(result => {
      dispatch(dataActions.replaceThreshold([Number(cur_data.temperature) + 5, Number(cur_data.temperature) - 5]));
    
    }).catch(err => {
        console.log(err)
    })
    setHeatorButton("Start");
    }
   
  };
  
  
  


  console.log(cur_data, thresh)
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
 
  return (
    <Box m="20px" display="flex" width="80%">
        <Header title="Fan/Heater Control"/>
        <Box flex="1">
        <Card sx={{maxHeight: 239,  maxWidth: 250, marginLeft: 10, marginTop: 5, background: colors.primary[400]}}>
      <img
                alt="profile-user"
                width="100%"
                height="70%"
                src={`../../assets/fan.png`}
                style={{ cursor: "pointer" }}
              />
        <CardContent>
        
          
        </CardContent>
        
      </Card>
      <Box display="flex" marginLeft={10} marginTop={2}>
              <Button type="submit" color="secondary" variant="contained" onClick={fanButtonHandler}>
               {fanButton} Fan
              </Button>
            </Box>
      </Box>
      <Box flex="1">
        <Card sx={{maxHeight: 239,  maxWidth: 250, marginLeft: 10, marginTop: 5, background: colors.primary[400]}}>
      <img
                alt="profile-user"
                width="100%"
                height="70%"
                src={`../../assets/heator.png`}
                style={{ cursor: "pointer" }}
              />
        <CardContent>
        
          
        </CardContent>
        
      </Card>
      <Box display="flex" marginLeft={10} marginTop={2}>
              <Button type="submit" color="secondary" variant="contained" onClick={heatorButtonHandler}>
               {heaterButton} Heater
              </Button>
            </Box>
      </Box>
     
     
        
           
    </Box>
  );
};

export default FanHeater;
