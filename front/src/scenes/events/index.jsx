import { Box, Typography, useTheme, Card, CardContent, Grid, Button } from "@mui/material";
import { tokens } from "../../theme";
import { mockDataInvoices } from "../../data/mockData";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { dataActions } from "../../store/dataSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const Event = () => {
  const theme = useTheme();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const colors = tokens(theme.palette.mode);
  const events = useSelector((state) => state.data.events);
  const [newEvent, setNewEvent] = useState([]);
  
 useEffect(() => {

    fetch("http://localhost:8080/events").then(response => {
          if (!response.ok){
            throw response;
          }
          return response.json();
        }).then(result => {
          console.log(result)
            setNewEvent(result.events)   
        }).catch(err => {
          console.log(err)
        });
  
 }, [events]);
        
  
  return (
    <Box m={2}>
      <Header title="EVENTS" subtitle="List of Events" />
      <Box mt={4}>
        <Grid container spacing={2}>
          {newEvent.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <Card sx={{ height: "100%"}}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Created By {event.creator}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                 {event.eventName}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Date: {event.eventDate}
                  </Typography>
                
                  <Box display="flex" justifyContent="end" mt="10px" >
              <Button type="submit" color="secondary" onClick={() => {
                 navigate(`/modal/${event._id}`);
              }}>
                X
              </Button>
            </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Event;
