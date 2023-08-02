import { useEffect, useState } from "react";
import FullCalendar, { CalendarApi, formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useDispatch, useSelector } from "react-redux";
import { dataActions } from "../../store/dataSlice";

const Calendar = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const curUser = localStorage.getItem('name');
  const user = useSelector(state => state.data.curUser);
  const [newEvent, setNewEvent] = useState([]);
  
  
  useEffect(() => {

    fetch("http://localhost:8080/events").then(response => {
          if (!response.ok){
            throw response;
          }
          return response.json();
        }).then(result => {
          console.log(result)
          const ne = result.events.map(item => {
            return {
              id: item._id,
              title: item.eventName,
              date: item.eventdate
            }
            
          })
            setNewEvent(ne)   
        }).catch(err => {
          console.log(err)
        });
  
 }, []);
 
        
  const handleDateClick = (selected) => {
    const title = prompt("Please enter a new title for your event");
   
    console.log(selected.startStr, "sss")
    if (title) {
      fetch("http://localhost:8080/create-event", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          eventName: title, 
          creator: curUser,
          eventDate: selected.startStr

        })
      }).then(response => {
        if (!response.ok){
          throw response;
        }
        return response.json()
      }).then(res => {
      dispatch(dataActions.replaceEvents(res.event))
      }).catch(err => {
        console.log(err)
      });
    
    }
   
  };

  const handleEventClick = (selected) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${selected.event.title}'`
      )
    ) {
      fetch("http://localhost:8080/delete-event" + curUser._id, {
        method: "DELETE"
      }).then(response => {
        if (!response.ok){
          throw response;
        }
        return response.json()
      }).then(res => {
      dispatch(dataActions.replaceEvents(res.event))
      }).catch(err => {
        console.log(err)
      });
    }
  };

  return (
    <Box m="20px">
      <Header title="Calendar" subtitle="Full Calendar Interactive Page" />

      <Box display="flex" justifyContent="space-between">
       
        {/* CALENDAR */}
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            eventsSet={(events) => setCurrentEvents(events)}
            events={newEvent}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;
