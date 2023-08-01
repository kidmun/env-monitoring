import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import DataDisplay from "./components/DataDisplay";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import ThresholdControl from "./scenes/threshold/ThresholdControl";
import LoginPage from "./scenes/login/LoginPage";
import { useDispatch, useSelector } from "react-redux";
import { dataActions } from "./store/dataSlice";
import Humidity from "./scenes/line/Humidity";
import FanHeater from "./scenes/fanheatercontrol";
import PrevData from "./scenes/prev_data";
import UserSidebar from "./scenes/global/UserSidebar";
import EditAccount from "./scenes/account/edit_account";
import ChangePassword from "./scenes/account/change_password";
import Event from "./scenes/events";
import DeleteEventModal from "./components/Modal";
function App() {
  const days = useSelector((state) => state.data.days);
  const accountStatus = useSelector((state) => state.data.accountStatus);
  console.log(accountStatus)
  const dispatch = useDispatch();
  
  const [loggedIn, setLoggedIn] = useState(false);
 const navigate = useNavigate();
  const currentTime = new Date().getTime();
 const storedExpirationTime = localStorage.getItem('expirationTime1');
 const storedExpirationTime4 = localStorage.getItem('expirationTime4');
 const last_days = localStorage.getItem('last_days');
 useEffect(() => {
  fetch("http://localhost:8080/last_days").then(response => {
    if (!response.ok){
      throw new Error("response not ok");
    }
    return response.json();
  }).then(res => {
    dispatch(dataActions.replaceDays(res.tot));

  }).catch(err => {
    console.log(err);
  });
  fetch("http://localhost:8080/last_hours").then(response => {
    if (!response.ok){
      throw new Error("response not ok");
    }
    return response.json();
  }).then(res => {
    dispatch(dataActions.replaceHours(res.tot));

  }).catch(err => {
    console.log(err);
  });
  fetch("http://localhost:8080/users").then(response => {
    if (!response.ok){
      throw new Error("response not ok");
    }
    return response.json();
  }).then(res => {
    console.log(res)
    const filteredData = res.users.map((obj, index) => {
      const { firstName, lastName, email, address, phoneNumber } = obj; // Filtered attributes
      return {id: index + 1 ,
        firstName: firstName,lastName: lastName, email: email, address: address, phone: phoneNumber
        // Adding id field
      };
    });
    dispatch(dataActions.replaceUsers(filteredData));

  }).catch(err => {
    console.log(err);
  });
  fetch("http://localhost:8080/all-data").then(response => {
    if (!response.ok){
      throw new Error("response not ok");
    }
    return response.json();
  }).then(res => {
    console.log(res)
    const filteredData = res.result.map((obj, index) => {
      const { temperature, humidity, analogValue, createdAt} = obj; // Filtered attributes
      return {id: index + 1 ,
        Temperature: Number(temperature),Humidity: Number(humidity), LightIntensity: Number(analogValue), Date: createdAt.slice(0,10), Time: createdAt.slice(11,19)
     
      };
    });
    console.log(filteredData)
    dispatch(dataActions.replacePrevData(filteredData));

  }).catch(err => {
    console.log(err);
  });
  fetch("http://localhost:8080/thresh").then(response => {
      if (!response.ok){
        throw new Error("response not ok");
      }
      return response.json();
    }).then(result => {
      dispatch(dataActions.replaceThreshold([result.threshold.temperatureMax, result.threshold.temperatureMin]));
    }).catch(err => {
      console.log(err)
    });;
 },[]);
 
if (storedExpirationTime && currentTime > parseInt(storedExpirationTime)) {
  
  localStorage.removeItem('token');
  localStorage.removeItem('id');
  localStorage.removeItem('name');
  localStorage.removeItem('expirationTime1');
  localStorage.removeItem('expirationTime2');
  localStorage.removeItem('expirationTime3');
}
const token = localStorage.getItem('token');
const id = localStorage.getItem('id');
useEffect(() => {
fetch("http://localhost:8080/users/" + id).then(response => {
  if (!response.ok){
    throw new Error("response not ok");
  }
  return response.json();
}).then(res => {
  dispatch(dataActions.setUser(res.user))
}).catch(err => {
  console.log(err)
});
}, []);


  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {accountStatus && <div className="app">
          <UserSidebar/>
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<EditAccount />} />
              <Route path="/change_password" element={<ChangePassword />} />
              </Routes>
          </main>
        </div>}
        {token && !accountStatus && <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/prediction" element={<Team />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/prev_data" element={<PrevData />} />
              <Route path="/events" element={<Event />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/temp_line" element={<Line />} />
              <Route path="/hum_line" element={<Humidity />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/display" element={<DataDisplay/>} />
              <Route path="/control-threshold" element={<ThresholdControl/>} />
              <Route path="/fan_heater" element={<FanHeater/>} />
              <Route path="/login" element={<LoginPage/>} />
              <Route path="/modal/:eventId" element={<DeleteEventModal/>} />
            </Routes>
          </main>
        </div>}
       {!token && <LoginPage/>} 
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
