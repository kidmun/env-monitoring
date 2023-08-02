import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";

import DataDisplay from "../../components/DataDisplay";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const  [data, setData] = useState({});
  const curUser = useSelector((state) => state.data.curUser);
  let name = "";
  if (curUser){
    name = curUser.firstName +" " +  curUser.lastName;
  }
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const title = "Welcome, " + name ;
  return (
    <Box m="20px" marginTop={0}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header subtitle={title}/>
      </Box>
      <DataDisplay/>
     
    </Box>
  );
};

export default Dashboard;
