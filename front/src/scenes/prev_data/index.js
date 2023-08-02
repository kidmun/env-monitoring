import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
const PrevData = () => {
  const  prev_data = useSelector((state) => state.data.prevData);
  console.log(prev_data)

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    
    {
      field: "Temperature",
      headerName: "Temperature",
      flex: 1,
      cellClassName: "name-column--cell",
    },
     
    {
      field: "Humidity",
      headerName: "Humidity",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "LightIntensity",
      headerName: "LightIntensity",
      flex: 1,
    },
    {
      field: "Date",
      headerName: "Date",
      flex: 1,
    },
    {
      field: "Time",
      headerName: "Time",
      flex: 1,
    }
  ];

  return (
    <Box m="20px">
      <Header
        title="Previos Data"
        subtitle="List of previous data"
      />
      <Box
        m="40px 0 0 0"
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={prev_data}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
        />
      </Box>
    </Box>
  );
};

export default PrevData;
