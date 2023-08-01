import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { dataActions } from "../../store/dataSlice";


const Topbar = () => {
  const accountStatus = useSelector((state) => state.data.accountStatus);
  const curUser = useSelector((state) => state.data.curUser);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const logoutHanlder = () => {
    const token = localStorage.getItem('token');
      if (token){
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        localStorage.removeItem('expirationTime1');
        localStorage.removeItem('expirationTime2');
      }
      navigate('/login');
  };
  const accountHanlder = () => {
   
    if (curUser){
      navigate('/');
      dispatch(dataActions.turnOnAccountStatus());
    }
    
  
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
      </Box>
      {/* ICONS */}
      <Box display="flex" marginRight={accountStatus ? 3: 0}>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>

      {!accountStatus &&   <Box>
        <IconButton onClick={accountHanlder}>
          <PersonOutlinedIcon />
        </IconButton>
        <IconButton onClick={logoutHanlder}>
          <LogoutIcon/>
        </IconButton>
      </Box>
      }
      
      </Box>
    </Box>
  );
};

export default Topbar;
