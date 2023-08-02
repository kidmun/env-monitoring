import { Box, Typography, useTheme, Button } from "@mui/material";
import regression from 'regression';
import { ResponsiveLine } from "@nivo/line";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { useState } from "react";

const Team = (props, { isCustomLineColors = false, isDashboard = false}) => {
  const [subtitleName, setSubtitleName] = useState("Prediction for Temperature(next 7 Days)");
  const [buttonStatus, setButtonStatus] = useState("Change to humidity");
  const [columnStatus, setColumnStatus] = useState("Temperature");

  const buttonHandler = () => {

    if (buttonStatus === "Change to humidity"){
      setButtonStatus("Change to Temperature");
      setSubtitleName("Prediction for Humidity(next 7 days)");
      setColumnStatus("Humidity");
    }
    else{
      setButtonStatus("Change to humidity");
      setSubtitleName("Prediction for Temperature(next 7 Days)");
      setColumnStatus("Temperature");
    }
  };
  const days = useSelector((state) => state.data.days);
  const day_data_temp = days[0].data.map(item => ([item.x, item.y]))
  const day_data_hum = days[1].data.map(item => ([item.x, item.y]))

  const result_temp = regression.linear(day_data_temp);
  const result_hum = regression.linear(day_data_hum);
  const currentDate = new Date();

  const cur_date = currentDate.getDate();
  let temp_total = [];
  let hum_total = [];
  let count = cur_date + 1;
  for(let i = 0; i < 7;i ++){
      if(count < 31){
        temp_total.push({x: count, y: result_temp.predict(count)[1]})
        hum_total.push({x: count, y: result_hum.predict(count)[1]})
        count += 1
      }
    
      else{
        temp_total.push({x: 1, y: result_temp.predict(1)[1]})
        hum_total.push({x: 1, y: result_hum.predict(1)[1]})
        count = 2
      }
  }
  

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "accessLevel",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              access === "admin"
                ? colors.greenAccent[600]
                : access === "manager"
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {access === "admin" && <AdminPanelSettingsOutlinedIcon />}
            {access === "manager" && <SecurityOutlinedIcon />}
            {access === "user" && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {access}
            </Typography>
          </Box>
        );
      },
    },
  ];
  

  return (
    <Box m="20px" marginTop={0}>
      <Header subtitle = {subtitleName}/>
      <Box display="flex" justifyContent="center" mt="20px" marginBottom={0} marginTop={0}>
              <Button type="button" color="secondary" variant="contained" onClick={buttonHandler}>
               {buttonStatus}
              </Button>
            </Box>
      <Box
        m="40px 0 0 0"
        marginTop={0}
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
       <ResponsiveLine
      data={[{id: "Date", data: buttonStatus === "Change to humidity" ? temp_total: hum_total}]}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
        tooltip: {
          container: {
            color: colors.primary[500],
          },
        },
      }}
      colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }} // added
      margin={{ top: 50, right: 200, bottom: 50, left: 45 }}
      xScale={{ type: "point"}}
      yScale={{
        type: "linear",
        min: "0",
        max: "200",
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Date", // added
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5, // added
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : columnStatus, // added
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />

     

      </Box>
    </Box>
  );
};

export default Team;
