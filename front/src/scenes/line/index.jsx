import { Box } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import { useDispatch, useSelector } from "react-redux";

const Line = () => {
  const days = [useSelector((state) => state.data.days)[0]];
  const hours = [useSelector((state) => state.data.hours)[0]];
  console.log(days, hours, "che")
  return (
    <Box m="20px" marginTop={0}>
      <Header title="Line Chart" />
      <Box height="75vh">
        <LineChart days={days} hours={hours}/>
      </Box>
    </Box>
  );
};

export default Line;
